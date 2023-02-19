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

        const userGuildsResponse = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/guilds`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } });
        const json = await userGuildsResponse.json();

        if(!userGuildsResponse.ok) return res.status(userGuildsResponse.status).json({ error: true, message: json.message, guilds: [] });
        /** @type {Array<string>} */ const userGuilds = json.reduce((previous, guild) => [ ...previous, guild.id ], []);

        const promises = guilds
            .filter(guild => userGuilds.includes(guild))
            .map(guild => new Promise(resolve => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${guild}`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } })
                .then(response => response.json()
                    .then(json => resolve(json))
                )
            ));
        /** @type {Array<Guild>} */ const fetchedGuilds = await Promise.all(promises);

        res.status(200).json({ error: false, message: '', guilds: fetchedGuilds });
    });
}