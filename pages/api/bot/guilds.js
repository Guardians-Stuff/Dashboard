import { NextApiRequest, NextApiResponse } from 'next';
import cacheData from 'memory-cache';

const BOT_APPLICATION_ID = '1469385720270426358';
const DISCORD_API_BASE = 'https://discord.com/api/v10';

const logger = require('@/lib/logger');

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    const receivedAuth = req.headers.authorization;
    const expectedAuth = `Bearer ${process.env.DISCORD_CLIENT_TOKEN}`;
    
    logger.api('/api/bot/guilds', 'DEBUG', `Received auth: ${receivedAuth ? 'present' : 'missing'}`);
    logger.api('/api/bot/guilds', 'DEBUG', `Expected auth: ${expectedAuth ? 'present' : 'missing'}`);
    
    if(receivedAuth !== expectedAuth) {
        logger.error(`Auth mismatch for /api/bot/guilds: received "${receivedAuth}" expected "${expectedAuth}"`);
        return res.status(403).json({ error: 'Unauthorized' });
    }

    /** @type {Array<Guild>} */ const cached = cacheData.get('/api/bot/guilds');
    if(cached) {
        logger.api('/api/bot/guilds', 200, `Returned cached ${cached.length} bot guilds`);
        return res.status(200).json(cached);
    }

    try {
        // Build headers with bot token authentication
        const headers = {
            'Authorization': `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
            'User-Agent': 'Guardian-Dashboard/1.0',
            'Accept': 'application/json'
        };

        // Fetch bot's guilds from Discord API
        const response = await fetch(
            `${DISCORD_API_BASE}/users/@me/guilds`,
            { headers }
        );

        if(!response.ok) {
            const errorText = await response.text();
            logger.error(`Discord API error: ${response.status} ${response.statusText} - ${errorText}`);
            logger.api('/api/bot/guilds', response.status, `Discord API error: ${response.statusText}`);
            return res.status(response.status).json({ error: `Discord API error: ${response.statusText}` });
        }

        /** @type {Array<Guild>} */ const botGuilds = await response.json();
        
        logger.api('/api/bot/guilds', 200, `Fetched ${botGuilds.length} bot guilds from Discord API`);
        
        // Transform Discord API format to expected format
        const transformedGuilds = botGuilds.map(guild => ({
            id: guild.id,
            name: guild.name,
            icon: guild.icon,
            iconURL: guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : null,
            owner: guild.owner || false,
            permissions: guild.permissions
        }));

        cacheData.put('/api/bot/guilds', transformedGuilds, 60 * 1000);

        res.status(200).json(transformedGuilds);
    } catch (error) {
        logger.error('Error fetching bot guilds:', error.message);
        logger.api('/api/bot/guilds', 500, 'Internal server error');
        res.status(500).json({ error: error.message });
    }
}