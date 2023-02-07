require('dotenv').config({ path: `${__dirname}/.env.local` });

const Next = require('next');
const https = require('https');
const http = require('http');
const url = require('url');
const fs = require('fs');

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
    }else{
        server = https;
        options = { key: fs.readFileSync(`${__dirname}/certificates/privkey.pem`), cert: fs.readFileSync(`${__dirname}/certificates/fullchain.pem`) };
    }

    server.createServer(options, async (req, res) => {
        try {
            const parsedUrl = url.parse(req.url, true);
            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);

            res.statusCode = 500;
            res.end('internal server error');
        }
    }).listen(protocol == 'https' ? 443 : 80, (err) => {
        if (err) throw err;
        console.log(`> Ready on ${protocol}://${hostname}`);
    });
});