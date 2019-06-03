require('dotenv').config();

const { env } = process;
const environment = env.NODE_ENV || 'dev';
const PORT = 3000;
const localhost = `http://localhost:${PORT}`;
const meetupOauthCallbackUrl = 'oauth/meetup/callback';

const config = {
    server: {
        port: PORT,
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
        oauthCallbackUrl: `https://www.freecodecampsacramento.org/${meetupOauthCallbackUrl}`,
    },
    heroku: {
        url: 'https://fcc-sac-discord-bot.herokuapp.com',
    },
    mlab: {
        uri: env.MLAB_URI,
    },
    redis: {
        host: 'localhost',
        port: 6379,
        ttl: 260,
    },
    session: {
        name: env.SESSION_NAME as string,
        secret: env.SESSION_SECRET as string,
    },
};

switch (environment) {
case 'dev':
    const SmeeClient = require('smee-client');
    const smee = new SmeeClient({
        source: 'https://smee.io/UzY4NhWFIGCF2w2',
        target: localhost,
        logger: console,
    });
    smee.start();
    config.meetup.oauthCallbackUrl = `${localhost}/${meetupOauthCallbackUrl}`;
    break;
default:
    break;
}

export default config;
