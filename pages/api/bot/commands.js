import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import cacheData from 'memory-cache';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    /** @type {Array<Guild>} */ const cached = cacheData.get('/api/bot/commands');
    if(cached) return res.status(200).json(cached);

    fetch(`${process.env.DISCORD_CLIENT_API}/api/commands`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } }).then(async response => {
        if(!response.ok) return res.status(response.status).send();

        const commands = await response.json();
        cacheData.put('/api/bot/commands', commands, 60 * 1000);

        res.status(200).json(commands);
    }).catch(() => res.status(500).send());
}