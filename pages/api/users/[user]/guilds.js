import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

import dbConnect from '@/lib/dbConnect';
import Guilds from '@/schemas/Guilds';

const logger = require('@/lib/logger');

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);
    if(!session) return res.status(403).json({ error: true, message: 'You must be logged in to do this', infractions: [] });

    await dbConnect();

    try {
        const results = await Guilds.find({ members: { $in: [ req.query.user ] } }, { guild: 1 });
        /** @type {Array<string>} */ const guildIds = results.map(result => {
            /** @type {import('@/schemas/Guilds').Guild} */ const guild = result.toObject();
            guild._id = result._id.toString();

            return guild.guild;
        });

        // Fetch all bot guilds
        const botGuildsResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds`, { 
            cache: 'no-cache', 
            headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } 
        });
        
        if(!botGuildsResponse.ok) {
            logger.error(`Error fetching bot guilds: ${botGuildsResponse.status}`);
            return res.status(500).json({ error: true, message: 'Failed to fetch bot guilds', guilds: [] });
        }

        /** @type {Array<Guild>} */ const botGuilds = await botGuildsResponse.json();
        
        // Create a map of bot guilds by ID for quick lookup
        const botGuildMap = botGuilds.reduce((map, guild) => {
            map[guild.id] = guild;
            return map;
        }, {});

        // Filter user's guilds to only those where the bot is present
        const fetchedGuilds = guildIds
            .map(guildId => botGuildMap[guildId])
            .filter(guild => guild !== undefined);

        // Check authorization for each guild
        const authorizedPromises = fetchedGuilds
            .map(guild => new Promise(resolve => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/guilds/${guild.id}`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } })
                .then(response => resolve({ guild: guild.id, authorized: response.ok }))
                .catch(() => resolve({ guild: guild.id, authorized: false }))
            ));
        /** @type {Record<string, boolean>} */ const authorizedGuilds = (await Promise.all(authorizedPromises)).reduce((previous, response) => ({ ...previous, [response.guild]: response.authorized }), {});

        const filteredGuilds = fetchedGuilds.filter(guild => authorizedGuilds[guild.id]);
        logger.api(`/api/users/${req.query.user}/guilds`, 200, `Fetched ${filteredGuilds.length} guilds`);
        return res.status(200).json({ error: false, message: '', guilds: filteredGuilds });
    } catch(error) {
        logger.error(`Error in /api/users/${req.query.user}/guilds:`, error.message);
        logger.api(`/api/users/${req.query.user}/guilds`, 500, 'Internal server error');
        return res.status(500).json({ error: true, message: 'Something went wrong', guilds: [] });
    }
}