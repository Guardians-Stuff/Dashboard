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
        /** @type {Array<string>} */ const guilds = results.map(result => {
            /** @type {import('@/schemas/Guilds').Guild} */ const guild = result.toObject();
            guild._id = result._id.toString();

            return guild.guild;
        });

        const guildPromises = guilds
            .map(guild => new Promise(resolve => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${guild}`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN }` } })
                .then(response => response.json()
                    .then(json => resolve(json))
                    .catch(() => resolve(null))
                )
                .catch(() => resolve(null))
            ));
        /** @type {Array<Guild>} */ const fetchedGuilds = (await Promise.all(guildPromises)).filter(guild => guild !== null);

        const authorizedPromises = guilds
            .map(guild => new Promise(resolve => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/guilds/${guild}`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } })
                .then(response => resolve({ guild: guild, authorized: response.ok }))
                .catch(() => resolve({ guild: guild, authorized: false }))
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