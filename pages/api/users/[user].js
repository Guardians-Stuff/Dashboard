import { NextApiRequest, NextApiResponse } from 'next';
import cacheData from 'memory-cache';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    const cached = cacheData.get(`/api/users/${req.query.user}`);
    if(cached) return res.status(200).json(cached);

    await fetch(`https://discord.com/api/users/${req.query.user}`, { headers: { 'Authorization': `Bot ${process.env.DISCORD_CLIENT_TOKEN}` } })
        .then(async response => {
            /** @type {User} */ const json = await response.json();
            const icon = json.avatar ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${json.discriminator % 5}.png`;
            json.displayAvatarURL = icon;

            cacheData.put(`/api/users/${req.query.user}`, json, 60 * 1000);

            res.status(response.status).json(json);
        }).catch(() => res.status(500).send());
}