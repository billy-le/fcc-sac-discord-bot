const config = require('./config');

import bot from './bot';
import express from 'express';
const app = express();
const bodyParser = require('body-parser');

const GENERAL_CHANNEL_ID = '581003420131917826';

app.use(bodyParser.json());

app.listen(config.server.port, () => {
    console.log(`The server is listening on PORT: ${config.server.port}`);

    app.post('/', (req, res) => {
        switch (req.headers['x-github-event']) {
            case 'issue_comment':
                const channel = bot.channels.get(GENERAL_CHANNEL_ID);
                channel.send('Hello, world!');
                return res.end();

            default:
                return res.end();
        }
    });
});
