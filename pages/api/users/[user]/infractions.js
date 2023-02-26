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
    let pagination = req.query.pagination;
    if(isNaN(pagination) || pagination < 1) pagination = 1;

    const filter = {};
    if(req.query.types) filter.type = { $in: req.query.types.split(',') };
    if(req.query.active) filter.active = true;

    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);
    if(!session && req.headers.authorization != `Bearer ${process.env.DISCORD_CLIENT_TOKEN}`) return res.status(403).json({
        error: true,
        message: 'You must be logged in to do this',
        infractions: [],
        pagination: { page: pagination, totalPages: 0 }
    });

    await dbConnect();

    /** @type {Array<Guild>} */ const guilds = (await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/users/${req.query.user}/guilds`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } })
        .then(response => response.json())
    ).guilds;

    const ids = await Infractions.find({}, '_id').sort({ _id: -1 }).lean();
    const pages = [];

    for(let i = 0; i < ids.length; i += 20){
        const tempIds = ids.slice(i, i + 20);
        pages.push(tempIds[0]);
    }

    Infractions
        .find({
            _id: { $lte: pages[pagination - 1]?._id },
            guild: { $in: guilds.map(guild => guild.id) },
            user: req.query.user,
            ...filter
        })
        .sort({ _id: -1 })
        .limit(20)
        .lean()
        .then(async (/** @type {Array<import('@/schemas/Infractions').Infraction>} */ results) => {
            const infractions = results.map(infraction => {
                infraction._id = infraction._id.toString();

                return infraction;
            });

            res.status(200).json({
                error: false,
                message: '',
                infractions: infractions,
                pagination: pagination
            });
        }).catch(() => {
            res.status(500).json({
                error: true,
                message: 'Something went wrong',
                infractions: [],
                pagination: { page: pagination, totalPages: pages.length }
            });
        });
}