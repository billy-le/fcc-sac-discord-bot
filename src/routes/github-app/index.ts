import express from 'express';
import { getDB } from '../../db';

const router = express.Router();

router.get('/', (req, res) => {
    const { query } = req;
    const { state } = query;
    let discordId: number | null, timeAgo: number | null;

    if (state) {
        const parseState = state.split(',');
        if (parseState.length === 2) {
            discordId = parseInt(parseState[0], 10);
            timeAgo = parseInt(parseState[1], 10);
            discordId = !isNaN(discordId) ? discordId : null;
            timeAgo = !isNaN(timeAgo) ? timeAgo : null;
            if (!discordId || !timeAgo) {
                return res.status(400).render('githubApp/error', { error: 'Invalid Request' });
            }
            const timeNow = Date.now();
            const isExpired = Math.floor((timeNow - timeAgo) / 1000 / 60) >= 1;
            if (isExpired) {
                return res.status(400).render('githubApp/error', {
                    error:
                        'The request has expired. Please try subscribing again with `!github-helper` in the Discord channel',
                });
            }
            if (query.setup_action !== 'install') {
                return res.status(400).render('githubApp/error', {
                    error: 'Please install from the Github App through the URL provided to you from the Discord bot',
                });
            }
            const db = getDB();

            db.collection('users')
                .findOneAndUpdate(
                    { 'discord.id': discordId },
                    { $set: { 'discord.isGitHubAppInstalled': true } },
                    { returnOriginal: false }
                )
                .then((_results: any) => {
                    res.render('githubApp/success');
                })
                .catch((err: any) => {
                    console.log(err);
                    res.status(500).render('/githubApp/error', { error: err });
                });
        }
    }
});

export default router;
