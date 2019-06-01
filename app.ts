import config from './config';

import { MongoClient } from 'mongodb';
import assert from 'assert';
import axios from 'axios';
import bodyParser from 'body-parser';
import bot from './bot';
import Discord, { RichEmbed } from 'discord.js';
import express from 'express';

const mongoClient = new MongoClient(config.mlab.uri as string, {
    useNewUrlParser: true,
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// declare database to export later;
let db: any;

// discord channel
const GENERAL_CHANNEL_ID = config.discord.channels.general;

mongoClient.connect(function(err, client: any) {
    assert.equal(null, err);
    console.log(
        `Successfully connect to ${client.s.options.dbName} database on mLabs`
    );

    db = client.db(client.s.options.dbName);

    app.listen(config.server.port, () => {
        console.log(
            `The server is listening at http://localhost:${config.server.port}`
        );

        bot.on('message', (message: any) => {
            if (!message.content.startsWith('!') || message.author.bot) {
                return;
            }

            const args = message.content.slice('!'.length).split(/ +/);
            const commandName = args.shift().toLowerCase();

            if (!bot.commands.has(commandName)) {
                return;
            }

            const command = bot.commands.get(commandName);

            try {
                command.execute(message, args, db);
            } catch (error) {
                message.reply(
                    'There was an error trying to execute that command!'
                );
            }
        });
    });
});

app.get('/oauth/meetup/callback', (req, res) => {
    const { code } = req.query;
    const meetupAccessTokenUrl = `https://secure.meetup.com/oauth2/access?client_id=${
        config.meetup.clientId
    }&client_secret=${
        config.meetup.secret
    }&grant_type=authorization_code&redirect_uri=http://localhost:3000/oauth/meetup/callback&code=${code}`;

    axios
        .post(
            meetupAccessTokenUrl,
            {},
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        )
        .then(res => {
            console.log(res);
            // todo securely store token
        })
        .catch(err => console.log(err))
        .finally(() => {
            return res.end();
        });
});

app.get('/oauth/meetup', (_req, res) => {
    const meetupAuthorizationPage = `https://secure.meetup.com/oauth2/authorize?client_id=${
        config.meetup.clientId
    }&response_type=code&redirect_uri=http://localhost:3000/oauth/meetup/callback`;
    return res.redirect(meetupAuthorizationPage);
});

// temporary webhook url
app.post('/', (req, res) => {
    const channel = bot.channels.get(GENERAL_CHANNEL_ID);
    switch (req.headers['x-github-event']) {
        case 'issue_comment':
            channel.send('Hello, world!');
            return res.end();
        case 'pull_request':
            const { action } = req.body;
            if (action === 'opened') {
                const regex = RegExp(/(!cr)\b/gi);
                const isRequestingCodeReview = regex.test(
                    req.body.pull_request.title
                );
                if (!isRequestingCodeReview) {
                    return;
                }
                const { repository, pull_request } = req.body;

                const msg: RichEmbed = new Discord.RichEmbed()
                    .setAuthor(repository.full_name)
                    .setThumbnail(pull_request.user.avatar_url)
                    .setTitle(
                        `Hi everyone! I'm requesting a code review on my project. Please take a look! I appreciate your feedback!`
                    )
                    .setURL(pull_request.url)
                    .setColor(0x00471b)
                    .setDescription(pull_request.body ? pull_request.body : '')
                    .setFooter(repository.description);

                channel.send(msg);
            }
            return res.end();
        default:
            return res.end();
    }
});

mongoClient.on('error', err => {
    console.log(err);
});

export { app, db };
