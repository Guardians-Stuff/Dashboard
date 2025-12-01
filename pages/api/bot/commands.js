import { NextApiRequest, NextApiResponse } from 'next';
import cacheData from 'memory-cache';

const BOT_APPLICATION_ID = '1422311269658005635';
const DISCORD_API_BASE = 'https://discord.com/api/v10';

/**
 * Transform Discord command option to subcommand format
 * @param {Object} option - Discord command option
 * @returns {Object} Transformed subcommand
 */
function transformSubcommand(option) {
    return {
        name: option.name,
        description: option.description || 'No description available'
    };
}

/**
 * Infer category from command name
 * @param {string} commandName - Command name
 * @returns {string} Category name
 */
function inferCategory(commandName) {
    const name = commandName.toLowerCase();
    
    if (name.includes('mod') || name.includes('ban') || name.includes('kick') || name.includes('warn') || name.includes('mute')) {
        return 'moderation';
    }
    if (name.includes('ticket') || name.includes('support')) {
        return 'tickets';
    }
    if (name.includes('infraction') || name.includes('warn') || name.includes('strike')) {
        return 'infractions';
    }
    if (name.includes('config') || name.includes('setting') || name.includes('setup')) {
        return 'configuration';
    }
    if (name.includes('info') || name.includes('help') || name.includes('about')) {
        return 'information';
    }
    if (name.includes('fun') || name.includes('game') || name.includes('meme')) {
        return 'fun';
    }
    if (name.includes('music') || name.includes('play') || name.includes('song')) {
        return 'music';
    }
    if (name.includes('utility') || name.includes('util')) {
        return 'utility';
    }
    
    return 'public';
}

/**
 * Transform Discord API command to expected format
 * @param {Object} discordCommand - Discord API command object
 * @returns {Object} Transformed command
 */
function transformCommand(discordCommand) {
    const subcommands = discordCommand.options 
        ? discordCommand.options
            .filter(option => option.type === 1) // Type 1 is SUB_COMMAND
            .map(transformSubcommand)
        : [];

    return {
        name: discordCommand.name,
        description: discordCommand.description || 'No description available',
        category: inferCategory(discordCommand.name),
        subcommands: subcommands.length > 0 ? subcommands : undefined
    };
}

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    const cached = cacheData.get('/api/bot/commands');
    if(cached) return res.status(200).json(cached);

    try {
        // Build headers with optional bot token authentication
        const headers = {
            'User-Agent': 'Guardian-Dashboard/1.0',
            'Accept': 'application/json'
        };
        
        // Add bot token if available (for authenticated requests)
        if (process.env.DISCORD_CLIENT_TOKEN) {
            headers['Authorization'] = `Bot ${process.env.DISCORD_CLIENT_TOKEN}`;
        }

        const response = await fetch(
            `${DISCORD_API_BASE}/applications/${BOT_APPLICATION_ID}/commands`,
            { headers }
        );

        if(!response.ok) {
            console.error(`Discord API error: ${response.status} ${response.statusText}`);
            return res.status(response.status).json({ error: 'Failed to fetch commands from Discord API' });
        }

        const discordCommands = await response.json();
        
        // Transform Discord commands to expected format
        const commands = discordCommands.map(transformCommand);
        
        // Cache for 5 minutes (300000ms)
        cacheData.put('/api/bot/commands', commands, 5 * 60 * 1000);

        res.status(200).json(commands);
    } catch (error) {
        console.error('Error fetching commands:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}