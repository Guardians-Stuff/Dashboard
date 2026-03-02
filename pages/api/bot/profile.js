import { NextApiRequest, NextApiResponse } from 'next';
import cacheData from 'memory-cache';

const BOT_APPLICATION_ID = '1469385720270426358';
const DISCORD_API_BASE = 'https://discord.com/api/v10';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    const cached = cacheData.get('/api/bot/profile');
    if(cached) return res.status(200).json(cached);

    try {
        // Check if Discord bot token is available
        if (!process.env.DISCORD_CLIENT_TOKEN) {
            console.error('DISCORD_CLIENT_TOKEN environment variable is not set');
            return res.status(500).json({ error: 'Discord bot token not configured' });
        }

        // Build headers with bot token authentication
        const headers = {
            'Authorization': `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
            'User-Agent': 'Guardian-Dashboard/1.0',
            'Accept': 'application/json'
        };

        // Fetch bot application info
        const response = await fetch(
            `${DISCORD_API_BASE}/applications/${BOT_APPLICATION_ID}`,
            { headers }
        );

        if(!response.ok) {
            console.error(`Discord API error: ${response.status} ${response.statusText}`);
            if(response.status === 401) {
                return res.status(401).json({ error: 'Invalid Discord bot token' });
            }
            return res.status(response.status).json({ error: 'Failed to fetch bot profile from Discord API' });
        }

        const botData = await response.json();
        
        // Construct avatar URL
        let avatarUrl = null;
        if (botData.icon) {
            avatarUrl = `https://cdn.discordapp.com/app-icons/${botData.id}/${botData.icon}.png`;
        } else {
            // Fallback to default avatar
            avatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
        }

        const profile = {
            id: botData.id,
            name: botData.name,
            description: botData.description || 'The most powerful and advanced multi-purpose Discord bot',
            avatar: avatarUrl,
            tags: botData.tags || [],
            bot_public: botData.bot_public,
            bot_require_code_grant: botData.bot_require_code_grant
        };
        
        // Cache for 10 minutes (600000ms)
        cacheData.put('/api/bot/profile', profile, 10 * 60 * 1000);

        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching bot profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}