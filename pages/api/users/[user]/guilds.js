import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

import dbConnect from '@/lib/dbConnect';
import Guilds from '@/schemas/Guilds';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);
    if(!session) return res.status(403).json({ error: true, message: 'You must be logged in to do this', infractions: [] });

    await dbConnect();

    Guilds.find({ members: { $in: [ req.query.user ] } }, { guild: 1 }).then(async (/** @type {Array<import('@/schemas/Guilds').Guild>} */ results) => {
        /** @type {Array<string>} */ const guilds = results.map(result => {
            /** @type {import('@/schemas/Guilds').Guild} */ const guild = result.toObject();
            guild._id = result._id.toString();

            return guild.guild;
        });

        const guildPromises = guilds
            .map(guild => new Promise(resolve => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${guild}`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN }` } })
                .then(response => response.json()
                    .then(json => resolve(json))
                )
            ));
        /** @type {Array<Guild>} */ const fetchedGuilds = await Promise.all(guildPromises);

        const authorizedPromises = guilds
            .map(guild => new Promise(resolve => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/guilds/${guild}`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } })
                .then(response => resolve({ guild: guild, authorized: response.ok }))
            ));
        /** @type {Record<string, boolean>} */ const authorizedGuilds = (await Promise.all(authorizedPromises)).reduce((previous, response) => ({ ...previous, [response.guild]: response.authorized }), {});

        res.status(200).json({ error: false, message: '', guilds: fetchedGuilds.filter(guild => authorizedGuilds[guild.id]) });
    });
}