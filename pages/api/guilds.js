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

    fetch(`${process.env.NEXT_PUBLIC_HOST}/api/bot/guilds`, { cache: 'no-cache', headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } }).then(async botGuildsResponse => {
        if(!botGuildsResponse.ok) return res.status(botGuildsResponse.status).send();

        /** @type {Array<Guild>} */ const json = await botGuildsResponse.json();
        const botGuilds = json.reduce((previous, guild) => [ ...previous, guild.id ], []);

        fetch('https://discord.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${session.account.access_token}` } })
            .then(async userGuildsReponse => {
                if(!userGuildsReponse.ok) return res.status(userGuildsReponse.status).send();
                /** @type {Array<APIGuild>} */ const userGuilds = await userGuildsReponse.json();
                
                const authorizedPromises = userGuilds
                    .filter(guild => botGuilds.includes(guild.id))
                    .map(guild => new Promise(resolve => fetch(`${process.env.NEXT_PUBLIC_HOST}/api/auth/guilds/${guild.id}`, { cache: 'no-cache', headers: { Cookie: req.headers.cookie } })
                        .then(response => resolve({ guild: guild.id, authorized: response.ok }))
                    ));
                /** @type {Record<string, boolean>} */ const authorizedGuilds = (await Promise.all(authorizedPromises)).reduce((previous, response) => ({ ...previous, [response.guild]: response.authorized }), {});

                userGuilds.map(guild => {
                    guild.iconURL = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : null;
                    guild.hasBot = botGuilds.includes(guild.id);
                    guild.authorized = !!authorizedGuilds[guild.id];
                });
    
                cacheData.put(`/api/guilds-${session.id}`, userGuilds, 60 * 1000);
    
                res.status(200).json(userGuilds);
            }).catch(() => res.status(500).send());
    }).catch(() => res.status(500).send());

}