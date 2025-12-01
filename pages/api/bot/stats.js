import { NextApiRequest, NextApiResponse } from 'next';
import cacheData from 'memory-cache';

const BOT_APPLICATION_ID = '1422311269658005635';
const DISCORD_API_BASE = 'https://discord.com/api/v10';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    // Allow public access to stats
    const cached = cacheData.get('/api/bot/stats');
    if(cached) return res.status(200).json(cached);

    try {
        if (!process.env.DISCORD_CLIENT_TOKEN) {
            return res.status(200).json({ servers: 0, commands: 0, uptime: 99.9 });
        }

        // Build headers with bot token authentication
        const headers = {
            'Authorization': `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
            'User-Agent': 'Guardian-Dashboard/1.0',
            'Accept': 'application/json'
        };

        // Fetch bot's guilds from Discord API
        const guildsResponse = await fetch(
            `${DISCORD_API_BASE}/users/@me/guilds`,
            { headers }
        );

        let serverCount = 0;
        if(guildsResponse.ok) {
            const botGuilds = await guildsResponse.json();
            serverCount = botGuilds.length;
        }

        // Fetch commands count
        const commandsResponse = await fetch(
            `${DISCORD_API_BASE}/applications/${BOT_APPLICATION_ID}/commands`,
            { headers }
        );

        let commandCount = 0;
        if(commandsResponse.ok) {
            const commands = await commandsResponse.json();
            commandCount = commands.length;
        }

        const stats = {
            servers: serverCount,
            commands: commandCount,
            uptime: 99.9,
            timestamp: Date.now()
        };

        // Cache for 2 minutes
        cacheData.put('/api/bot/stats', stats, 2 * 60 * 1000);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching bot stats:', error);
        res.status(200).json({ servers: 0, commands: 0, uptime: 99.9 });
    }
}

