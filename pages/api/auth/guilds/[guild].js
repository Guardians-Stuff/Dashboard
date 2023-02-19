import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);
    if(!session) return res.status(403).send();

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds/${req.query.guild}/members/${session.id}`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } })
        .then(async response => {
            if(!response.ok) return res.status(response.status).send();

            /** @type {GuildMember} */ const json = await response.json();

            if(!json.owner && !json.administrator) return res.status(401).send();
            res.status(200).send({ owner: json.owner, administrator: json.administrator });
        }).catch(() => res.status(500).send());
}