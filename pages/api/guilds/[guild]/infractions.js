import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

import dbConnect from '@/lib/dbConnect';
import Infractions from '@/schemas/Infractions';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);
    if(!session && req.headers.authorization != `Bearer ${process.env.DISCORD_CLIENT_TOKEN}`) return res.status(403).json({ error: true, message: 'You must be logged in to do this', infractions: [] });

    await dbConnect();

    Infractions.find({ guild: req.query.guild }).sort({ _id: -1 }).then(async (/** @type {Array<import('@/schemas/Infractions').Infraction>} */ results) => {
        /** @type {Array<import('@/schemas/Infractions').Infraction>} */ const infractions = results.map(result => {
            /** @type {import('@/schemas/Infractions').Infraction} */ const infraction = result.toObject();
            infraction._id = result._id.toString();

            return infraction;
        });


        await verifyPermissions(req, res, session, infractions);
    }).catch(() => {
        res.status(500).json({ error: true, message: 'Something went wrong', infractions: [] });
    });
}

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 * @param {import('next-auth/providers/discord').DiscordProfile} session
 * @param {Array<import('@/schemas/Infractions').Infraction>} infractions
 */
async function verifyPermissions(req, res, session, infractions){
    if(session){
        const auth = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/guilds/${req.query.guild}`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } });
        if(!auth.ok) return res.status(401).json({ error: true, message: 'Unauthorized', infractions: [] });
    }

    res.status(200).json({ error: false, message: '', infractions: infractions });
}