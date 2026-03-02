import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import cacheData from 'memory-cache';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions);
    if(!session) return res.status(403).json({ error: true, message: 'You must be logged in to do this' });

    const cached = cacheData.get(`/api/users/${req.query.user}`);
    if(cached) return res.status(200).json(cached);

    try {
        const response = await fetch(`https://discord.com/api/users/${req.query.user}`, {
            headers: {
                'Authorization': `Bot ${process.env.DISCORD_CLIENT_TOKEN}`,
                'User-Agent': 'Guardian-Dashboard/1.0'
            }
        });

        if(!response.ok) {
            console.error(`Discord API error: ${response.status} ${response.statusText}`);
            if(response.status === 404) {
                return res.status(404).json({ error: true, message: 'User not found' });
            }
            return res.status(response.status).json({ error: true, message: 'Failed to fetch user from Discord API' });
        }

        /** @type {User} */ const json = await response.json();
        const icon = json.avatar ? `https://cdn.discordapp.com/avatars/${json.id}/${json.avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${json.discriminator % 5}.png`;
        json.displayAvatarURL = icon;

        cacheData.put(`/api/users/${req.query.user}`, json, 60 * 1000);

        res.status(200).json(json);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: true, message: 'Internal server error' });
    }
}