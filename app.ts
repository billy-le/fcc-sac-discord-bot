import config from './config';
import bot from './bot';
import express from 'express';
import { MongoClient } from 'mongodb';
import assert from 'assert';
import bodyParser from 'body-parser';
import Discord, { RichEmbed } from 'discord.js';

const mongoClient = new MongoClient(config.mlab.uri as string, {
    useNewUrlParser: true,
});

const app = express();
app.use(bodyParser.json());

// declare database to export later;
let db: any;

// discord channel
const GENERAL_CHANNEL_ID = config.discord.channelIds.generalId;

mongoClient.connect(function(err, client: any) {
    assert.equal(null, err);
    console.log(
        `Successfully connect to ${client.s.options.dbName} database on mLabs`
    );

    db = client.db(client.s.options.dbName);

    app.listen(config.server.port, () => {
        console.log(`The server is listening on PORT: ${config.server.port}`);

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
