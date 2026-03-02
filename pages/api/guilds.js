import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import cacheData from 'memory-cache';

const logger = require('@/lib/logger');

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    try {
        /** @type {import('next-auth/providers/discord').DiscordProfile} */ const session = await getServerSession(req, res, authOptions);
        if(!session) return res.status(403).send();

        const cached = cacheData.get(`/api/guilds-${session.id}`);
        if(cached) return res.status(200).json(cached);

        let botGuilds = [];
        try {
            // Use IPv4 localhost to avoid IPv6 connection issues
            const hostUrl = process.env.NEXT_PUBLIC_HOST?.replace('::1', '127.0.0.1') || 'http://127.0.0.1:3000';
            const botGuildsResponse = await fetch(`${hostUrl}/api/bot/guilds`, { 
                cache: 'no-cache', 
                headers: { Authorization: `Bearer ${process.env.DISCORD_CLIENT_TOKEN}` } 
            });
            
            if(!botGuildsResponse.ok) {
                const errorText = await botGuildsResponse.text();
                logger.error(`Failed to fetch bot guilds: ${botGuildsResponse.status} - ${errorText}`);
                // Continue with empty bot guilds list if bot API fails
            } else {
                /** @type {Array<Guild>} */ const botGuildsJson = await botGuildsResponse.json();
                botGuilds = botGuildsJson.reduce((previous, guild) => [ ...previous, guild.id ], []);
                logger.api('/api/guilds', 200, `Fetched ${botGuilds.length} bot guilds: ${botGuilds.join(', ')}`);
            }
        } catch (error) {
            logger.error(`Error fetching bot guilds: ${error.message}`);
            // Continue with empty bot guilds list if fetch fails
        }

        const userGuildsResponse = await fetch('https://discord.com/api/users/@me/guilds', { headers: { Authorization: `Bearer ${session.account.access_token}` } });
        if(!userGuildsResponse.ok) return res.status(userGuildsResponse.status).send();
        
        /** @type {Array<APIGuild>} */ const userGuilds = await userGuildsResponse.json();
        logger.api('/api/guilds', 200, `Fetched ${userGuilds.length} user guilds: ${userGuilds.map(g => g.id).join(', ')}`);
        
        // Filter to only include guilds where user is owner or has admin privileges
        const ADMINISTRATOR_PERMISSION = BigInt(0x8); // 0x8 = ADMINISTRATOR permission
        const adminGuilds = userGuilds.filter(guild => {
            // Check if user is owner
            if (guild.owner === true) return true;
            
            // Check if user has ADMINISTRATOR permission
            if (guild.permissions) {
                const perms = BigInt(guild.permissions);
                const hasAdminPerm = (perms & ADMINISTRATOR_PERMISSION) === ADMINISTRATOR_PERMISSION;
                return hasAdminPerm;
            }
            
            return false;
        });
        logger.api('/api/guilds', 200, `Filtered to ${adminGuilds.length} admin/owner guilds: ${adminGuilds.map(g => g.id).join(', ')}`);
        
        const authorizedPromises = adminGuilds
            .filter(guild => botGuilds.includes(guild.id))
            .map(guild => new Promise(resolve => {
                // If bot is in the guild and user is already verified as admin/owner via Discord API,
                // mark as authorized without needing to check bot API server
                logger.api('/api/guilds', 200, `Guild ${guild.id}: Bot present, user is admin/owner - marking as authorized`);
                resolve({ guild: guild.id, authorized: true });
            }));
        /** @type {Record<string, boolean>} */ const authorizedGuilds = (await Promise.all(authorizedPromises)).reduce((previous, response) => ({ ...previous, [response.guild]: response.authorized }), {});

        adminGuilds.map(guild => {
            guild.iconURL = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp` : null;
            guild.hasBot = botGuilds.includes(guild.id);
            guild.authorized = !!authorizedGuilds[guild.id];
            logger.api('/api/guilds', 200, `Guild ${guild.name} (${guild.id}): hasBot=${guild.hasBot}, authorized=${guild.authorized}`);
        });

        cacheData.put(`/api/guilds-${session.id}`, adminGuilds, 60 * 1000);

        logger.api('/api/guilds', 200, `Fetched ${adminGuilds.length} admin/owner guilds`);
        return res.status(200).json(adminGuilds);
    } catch(error) {
        logger.error('Error in /api/guilds:', error.message);
        logger.api('/api/guilds', 500, 'Internal server error');
        return res.status(500).send();
    }
}