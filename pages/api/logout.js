import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

/**
 * @param {NextApiRequest} req
 * @param {NextApiResponse} res
 */
export default function handler(req, res) {
    res.setHeader('Set-Cookie', [
        serialize('next-auth.session-token', '', { maxAge: -1, path: '/' }),
        serialize('__Secure-next-auth.session-token', '', { maxAge: -1, path: '/' })
    ])
        .writeHead(302, { Location: '/' })
        .end();
}