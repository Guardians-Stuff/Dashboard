import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import cacheData from 'memory-cache';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);
    if(!session) return res.status(403).send();

    /** @type {Array<Guild>} */ const cached = cacheData.get('/api/bot/guilds');
    if(cached) return res.status(200).json(cached);

    fetch(`${process.env.NEXT_PUBLIC_HOST}/api/guilds`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } }).then(async userGuildsResponse => {
        if(!userGuildsResponse.ok) return res.status(userGuildsResponse.status).send();

        /** @type {Array<APIGuild>} */ const userGuilds = await userGuildsResponse.json();

        fetch(`${process.env.DISCORD_CLIENT_API}/api/guilds`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } }).then(async botGuildsResponse => {
            if(!botGuildsResponse.ok) return res.status(botGuildsResponse.status).send();

            /** @type {Array<Guild>} */ const botGuilds = await botGuildsResponse.json();
            botGuilds.forEach(guild => userGuilds[userGuilds.indexOf(userGuilds.find(g => g.id == guild.id))].hasBot = true);

            cacheData.put('/api/bot/guilds', userGuilds, 60 * 1000);

            res.status(200).json(userGuilds);
        }).catch(() => res.status(500).send());
    });

}