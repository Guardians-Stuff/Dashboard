import { NextApiRequest, NextApiResponse } from 'next';
import cacheData from 'memory-cache';

const BOT_APPLICATION_ID = '1422311269658005635';
const DISCORD_API_BASE = 'https://discord.com/api/v10';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    if(req.headers.authorization != `Bearer ${process.env.DISCORD_CLIENT_TOKEN}`) return res.status(403).send();

    /** @type {Array<Guild>} */ const cached = cacheData.get('/api/bot/guilds');
    if(cached) return res.status(200).json(cached);

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
            console.error(`Discord API error: ${response.status} ${response.statusText}`);
            return res.status(response.status).send();
        }

        /** @type {Array<Guild>} */ const botGuilds = await response.json();
        
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
        console.error('Error fetching bot guilds:', error);
        res.status(500).send();
    }
}