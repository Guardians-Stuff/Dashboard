require('dotenv').config({ path: `${__dirname}/.env.local` });

const Next = require('next');
const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');
const logger = require('./lib/logger');

const dev = process.env.NODE_ENV === 'development';
const protocol = process.env.NEXT_PROTOCOL;
const hostname = process.env.NEXT_HOSTNAME;

const app = Next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    let server;
    let options = {};

    if(protocol == 'http') {
        server = http;
        logger.warn('Running in HTTP mode - not secure!');
    } else {
        server = https;
        try {
            options = { 
                key: fs.readFileSync(`${__dirname}/certificates/privkey.pem`), 
                cert: fs.readFileSync(`${__dirname}/certificates/fullchain.pem`) 
            };
            logger.success('SSL certificates loaded successfully');
        } catch (err) {
            logger.error('Failed to load SSL certificates:', err.message);
            process.exit(1);
        }
    }

    const startTime = Date.now();
    server.createServer(options, async (req, res) => {
        const requestStart = Date.now();
        const method = req.method || 'GET';
        const path = req.url || '/';
        
        // Log request
        res.on('finish', () => {
            const duration = Date.now() - requestStart;
            logger.http(method, path, res.statusCode, duration);
        });

        try {
            const parsedUrl = url.parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            logger.error('Error occurred handling request', path, err.message);
            if (err.stack) {
                logger.debug('Stack trace:', err.stack);
            }

            res.statusCode = 500;
            res.end('internal server error');
        }
    }).listen(protocol == 'https' ? 443 : 80, (err) => {
        if (err) {
            logger.error('Failed to start server:', err.message);
            throw err;
        }
        
        const startupTime = Date.now() - startTime;
        const port = protocol == 'https' ? 443 : 80;
        
        // Display startup information in a nice box
        logger.startup({
            protocol: protocol,
            hostname: hostname,
            environment: dev ? 'development' : 'production',
            port: port,
            startupTime: startupTime
        });
        
        logger.success(`Server is ready and listening on ${protocol}://${hostname}:${port}`);
    });
}).catch((err) => {
    logger.error('Failed to prepare Next.js app:', err.message);
    if (err.stack) {
        logger.debug('Stack trace:', err.stack);
    }
    process.exit(1);
});