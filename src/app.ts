'use strict';

import { MongoClient } from 'mongodb';
import routes from './routes';
import assert from 'assert';
import bodyParser from 'body-parser';
import bot from './bot';
import config from '../config';
import express from 'express';
import helmet from 'helmet';
import path from 'path';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

// initial Redis and connect to express-session
const redisClient = redis.createClient();
const redisStore = connectRedis(session);

// express configurations
const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname + '/../views'));
app.use(helmet());
app.use(
    session({
        ...config.session,
        store: new redisStore({ ...config.redis, client: redisClient }),
        saveUninitialized: false,
        resave: false,
    })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

// declare database to export later;
let db: any;

const mongoClient = new MongoClient(config.mlab.uri as string, {
    useNewUrlParser: true,
});

// connect to MongoDB database and start application server
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
    }).on('error', err => {
        console.log('Express error: ', err);
    });
});

// Error Handlers
redisClient.on('error', err => {
    console.log('Redis error: ', err);
});

mongoClient.on('error', err => {
    console.log('MongoDB error: ', err);
});

process.on('uncaughtException', err => {
    console.log('process error: ', err);
});

export { db };
