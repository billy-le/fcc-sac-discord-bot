import config from './config';
import bot from './bot';
import express from 'express';
import { MongoClient } from 'mongodb';
import assert from 'assert';
import bodyParser from 'body-parser';

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
    });
});

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
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }

    const discordUser = {
        discordUserId: message.author.id,
        discordUsername: message.author.username,
    };

    db.collection('users')
        .findOne({ discordUserId: discordUser.discordUserId })
        .then((user: any) => {
            if (!user) {
                db.collection('users')
                    .insertOne(discordUser)
                    .then((user: any) => {
                        message.author.send(
                            `Congratulations! You're all set to go, ${
                                user.ops[0].discordUsername
                            }`
                        );
                    });
            }
        })
        .catch((err: any) => console.log(err));
});

mongoClient.on('error', err => {
    console.log(err);
});

export { app, db };
