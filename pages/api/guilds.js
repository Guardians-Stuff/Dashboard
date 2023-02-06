import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import cacheData from 'memory-cache';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);
    if(!session) return res.status(403).send();

    const cached = cacheData.get(`/api/guilds-${session.id}`);
    if(cached) return res.status(200).json(cached);

    await fetch('https://discord.com/api/users/@me/guilds', { headers: { 'Authorization': `Bearer ${session.account.access_token}` } })
        .then(async response => {
            if(!response.ok) return res.status(response.status).send();

            /** @type {Array<APIGuild>} */ const json = await response.json();
            json.map(guild => {
                guild.iconURL = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : null;
                guild.hasBot = false;
            });

            cacheData.put(`/api/guilds-${session.id}`, json, 60 * 1000);

            res.status(200).json(json);
        }).catch(() => res.status(500).send());
}