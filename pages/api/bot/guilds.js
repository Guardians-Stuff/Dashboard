import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import cacheData from 'memory-cache';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);

    if(req.headers.authorization != `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` && !session?.admin) return res.status(403).send();

    /** @type {Array<Guild>} */ const cached = cacheData.get('/api/bot/guilds');
    if(cached) return res.status(200).json(cached);

    fetch(`${process.env.DISCORD_CLIENT_API}/api/guilds`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } }).then(async response => {
        if(!response.ok) return res.status(response.status).send();

        /** @type {Array<Guild>} */ const botGuilds = await response.json();
        cacheData.put('/api/bot/guilds', botGuilds, 60 * 1000);

        res.status(200).json(botGuilds);
    }).catch(() => res.status(500).send());
}