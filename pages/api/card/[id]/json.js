import { NextApiRequest, NextApiResponse } from 'next';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default async function handler(req, res) {
    res.status(200).json({
        author_name: 'Viewing profile | Made with Guardian',
        type: 'photo'
    });
}