import bot from '../../bot';
import config from '../../../config';
import Discord, { RichEmbed } from 'discord.js';
import express from 'express';

const GENERAL_CHANNEL_ID = config.discord.channels.general;

const router = express.Router();

router.post('/', (req, res) => {
    const channel = bot.channels.get(GENERAL_CHANNEL_ID);
    switch (req.headers['x-github-event']) {
        case 'issue_comment':
            channel.send('Hello, world!');
            return res.end();
        case 'pull_request':
            const { action } = req.body;
            if (action === 'opened') {
                const regex = RegExp(/(!cr)\b/gi);
                const isRequestingCodeReview = regex.test(req.body.pull_request.title);
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

export default router;
