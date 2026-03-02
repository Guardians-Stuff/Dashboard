import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

import dbConnect from '@/lib/dbConnect';
import Infractions from '@/schemas/Infractions';

export default async function handler(req, res) {
    let pagination = parseInt(req.query.pagination) || 1;
    if (isNaN(pagination) || pagination < 1) pagination = 1;

    const guildId = req.params.guild;
    
    if (!guildId) {
        return res.status(400).json({
            error: true,
            message: 'Guild ID is required',
            infractions: [],
            pagination: { page: pagination, totalPages: 0 }
        });
    }

    const filter = { guild: guildId };
    
    if (req.query.id) {
        filter['$or'] = [
            { user: { $regex: req.query.id, $options: 'i' } },
            { issuer: { $regex: req.query.id, $options: 'i' } }
        ];
    }
    
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
        console.log('Connecting to database...');
        await dbConnect();
        console.log('Database connected successfully');

        const totalCount = await Infractions.countDocuments(filter);
        const totalPages = Math.ceil(totalCount / 20);
        
        console.log(`Found ${totalCount} infractions for guild ${guildId}`);

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

        await verifyPermissions(req, res, session, serializedInfractions, { 
            page: pagination, 
            totalPages: totalPages 
        });

    } catch (error) {
        console.error('Error fetching infractions:', error);
        res.status(500).json({
            error: true,
            message: 'Something went wrong: ' + error.message,
            infractions: [],
            pagination: { page: pagination, totalPages: 0 }
        });
    }
}

async function verifyPermissions(req, res, session, infractions, pagination) {
    if (session) {
        const guildId = req.params.guild;
        const hostUrl = process.env.NEXT_PUBLIC_HOST?.replace('::1', '127.0.0.1') || 'http://127.0.0.1:3000';
        const auth = await fetch(`${hostUrl}/api/auth/guilds/${guildId}`, { 
            cache: 'no-cache', 
            headers: { Cookie: req.headers.cookie } 
        });
        
        if (!auth.ok) {
            console.log('Authorization failed for guild:', guildId);
            return res.status(401).json({
                error: true,
                message: 'Unauthorized',
                infractions: [],
                pagination: pagination
            });
        }
    }

    console.log(`Successfully returning ${infractions.length} infractions`);
    res.status(200).json({
        error: false,
        message: '',
        infractions: infractions,
        pagination: pagination
    });
}