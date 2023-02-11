import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

import dbConnect from '@/lib/dbConnect';
import Tickets from '@/schemas/Tickets';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);
    if(!session && req.headers.authorization != `Bearer ${process.env.DISCORD_CLIENT_TOKEN}`) return res.status(403).json({ error: true, message: 'You must be logged in to do this', tickets: [] });

    await dbConnect();

    Tickets.find({ guild: req.query.guild }, 'guild user channel active').sort({ _id: -1 }).then(async (/** @type {Array<import('@/schemas/Tickets').Ticket>} */ results) => {
        /** @type {Array<import('@/schemas/Tickets').Ticket>} */ const tickets = results.map(result => {
            /** @type {import('@/schemas/Tickets').Ticket} */ const ticket = result.toObject();
            ticket._id = result._id.toString();
            ticket.time = result._id.getTimestamp().valueOf();
            ticket.messages = [];

            return ticket;
        });


        await verifyPermissions(req, res, session, tickets);
    }).catch(() => {
        res.status(500).json({ error: true, message: 'Something went wrong', tickets: [] });
    });
}

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 * @param {import('next-auth/providers/discord').DiscordProfile} session
 * @param {Array<import('@/schemas/Tickets').Ticket>} tickets
 */
async function verifyPermissions(req, res, session, tickets){
    if(session){
        const guild = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${req.query.guild}/`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } });
        if(!guild.ok) return res.status(401).json({ error: true, message: 'Unauthorized', tickets: [] });
    }

    res.status(200).json({ error: false, message: '', tickets: tickets });
}