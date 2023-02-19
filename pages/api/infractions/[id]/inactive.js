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
    const session = await getServerSession(req, res, authOptions);
    if(!session) return res.status(403).json({ error: true, message: 'You must be logged in to do this' });

    await dbConnect();
    
    await Infractions.findById(req.query.id).then(async (/** @type {import('@/schemas/Infractions').Infraction} */ infraction) => {
        const auth = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/guilds/${req.query.guild}`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } });
        if(!auth.ok) return res.status(401).send({ error: true, message: 'Unauthorized' });

        if(!infraction) return res.status(404).json({ error: true, message: 'Infraction not found' });
        if(!infraction.active) return res.status(400).json({ error: true, message: 'Infraction is not active' });

        const response = await fetch(`${process.env.DISCORD_CLIENT_API}/infractions/${req.query.id}/inactive`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } });
        if(!response.ok) res.status(response.status).json({ error: true, message: 'Something went wrong' });

        infraction.active = false;
        await infraction.save();

        res.status(200).json({ error: false, message: 'Infraction is now inactive' });
    }).catch(() => {
        return res.status(400).json({ error: true, message: 'Something went wrong' });
    });
    
}