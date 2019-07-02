import { Message } from 'discord.js';
import { getDB } from '../db';

module.exports = {
    name: 'github-helper',
    description: '',
    execute(message: Message, _args: string[]) {
        if (!message.author) return;

        const discordUser = {
            id: parseInt(message.author.id, 10),
            username: message.author.username,
        };

        const db = getDB();

        db.collection('users')
            .findOne({
                'discord.id': discordUser.id,
            })
            .then((user: any) => {
                const gitHubAppInstallMsg = (state: number) =>
                    `Hello! Please follow the link to get some basics features for your Github account. It will listen to different events like when you are creating a new repo, an issue, or even ask the community for a code review on your pull request! freeCodeCamp Sacramento Community! https://github.com/apps/fcc-sac-discord-bot/installations/new?state=${state},${Date.now()}`;
                if (!user) {
                    return db
                        .collection('users')
                        .insertOne({
                            discord: {
                                id: discordUser.id,
                                username: discordUser.username,
                                isGitHubAppInstalled: false,
                            },
                        })
                        .then((_user: any) => {
                            return message.author.send(gitHubAppInstallMsg(discordUser.id));
                        })
                        .catch((err: any) => {
                            console.log(err);
                        });
                }
                if (!user.discord.isGitHubAppInstalled) {
                    return message.author.send(gitHubAppInstallMsg(discordUser.id));
                }
            });
    },
};
