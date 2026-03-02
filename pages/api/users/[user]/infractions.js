import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

import dbConnect from '@/lib/dbConnect';
import Infractions from '@/schemas/Infractions';

const logger = require('@/lib/logger');

export default async function handler(req, res) {
    let pagination = parseInt(req.query.pagination) || 1;
    if (isNaN(pagination) || pagination < 1) pagination = 1;

    const userId = req.query.user;
    
    if (!userId) {
        return res.status(400).json({
            error: true,
            message: 'User ID is required',
            infractions: [],
            pagination: { page: pagination, totalPages: 0 }
        });
    }

    const filter = { user: userId };
    
    if (req.query.types && req.query.types.length > 0) {
        const types = Array.isArray(req.query.types) ? req.query.types : req.query.types.split(',');
        filter.type = { $in: types };
    }
    
    if (req.query.active === 'true') {
        filter.active = true;
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session && req.headers.authorization !== `Bearer ${process.env.DISCORD_CLIENT_TOKEN}`) {
        return res.status(403).json({
            error: true,
            message: 'You must be logged in to do this',
            infractions: [],
            pagination: { page: pagination, totalPages: 0 }
        });
    }

    try {
        console.log('Connecting to database for user infractions...');
        await dbConnect();
        console.log('Database connected successfully');

        let userGuilds = [];
        try {
            const hostUrl = process.env.NEXT_PUBLIC_HOST?.replace('::1', '127.0.0.1') || 'http://127.0.0.1:3000';
            const guildsResponse = await fetch(`${hostUrl}/api/users/${userId}/guilds`, { 
                cache: 'no-cache', 
                headers: { Cookie: req.headers.cookie } 
            });
            
            if (guildsResponse.ok) {
                const guildsData = await guildsResponse.json();
                userGuilds = (guildsData.guilds || []).map(guild => guild.id);
                console.log(`User ${userId} is in ${userGuilds.length} guilds`);
            }
        } catch (error) {
            logger.warn(`Error fetching guilds for user ${userId}:`, error.message);
        }

        if (userGuilds.length > 0) {
            filter.guild = { $in: userGuilds };
        }

        const totalCount = await Infractions.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / 20);
        
        console.log(`Found ${totalCount} infractions for user ${userId}`);

        const infractions = await Infractions
            .find(filter)
            .sort({ time: -1 })
            .skip((pagination - 1) * 20)
            .limit(20)
            .lean();

        console.log(`Fetched ${infractions.length} infractions for page ${pagination}`);

        const serializedInfractions = infractions.map(infraction => ({
            ...infraction,
            _id: infraction._id.toString()
        }));

        logger.api(`/api/users/${userId}/infractions`, 200, `Returned ${infractions.length} infractions`);
        
        res.status(200).json({
            error: false,
            message: '',
            infractions: serializedInfractions,
            pagination: { page: pagination, totalPages: totalPages }
        });

    } catch (error) {
        console.error('Error fetching user infractions:', error);
        logger.error(`Error fetching infractions for user ${userId}:`, error);
        res.status(500).json({
            error: true,
            message: 'Something went wrong: ' + error.message,
            infractions: [],
            pagination: { page: pagination, totalPages: 0 }
        });
    }
}