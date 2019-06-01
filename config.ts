require('dotenv').config();

const { env } = process;
const environment = env.NODE_ENV || 'dev';

switch (environment) {
case 'dev':
    const SmeeClient = require('smee-client');
    const smee = new SmeeClient({
        source: 'https://smee.io/UzY4NhWFIGCF2w2',
        target: 'http://localhost:3000',
        logger: console,
    });
    smee.start();
    break;
default:
    break;
}

export default {
    server: {
        port: 3000,
    },
    discord: {
        clientId: env.DISCORD_CLIENT_ID,
        secret: env.DISCORD_CLIENT_SECRET,
        permissionsInt: 67585,
        token: env.DISCORD_TOKEN,
        channels: {
            general: env.DISCORD_GENERAL_CHANNEL_ID,
        },
    },
    meetup: {
        clientId: env.MEETUP_CLIENT_ID,
        secret: env.MEETUP_SECRET,
    },
    heroku: {
        url: 'https://fcc-sac-discord-bot.herokuapp.com',
    },
    mlab: {
        uri: env.MLAB_URI,
    },
};
