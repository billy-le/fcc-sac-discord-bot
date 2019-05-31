import { Message } from 'discord.js';

module.exports = {
    name: 'github-helper',
    description: '',
    execute(message: Message, _args: string[], db: any) {
        if (!message.author) return;

        const discordUser = {
            id: message.author.id,
            username: message.author.username,
        };

        db.collection('users')
            .findOne({ discord: { id: discordUser.id } })
            .then((user: any) => {
                const gitHubAppInstallMsg = (state: string) =>
                    `Hello! Please follow the link to get some basics features for your Github account. It will listen to different events like when you are creating a new repo, an issue, or even ask the community for a code review on your pull request! freeCodeCamp Sacramento Community! https://github.com/apps/fcc-sac-discord-bot/installations/new?state=${state}`;
                if (!user) {
                    return db
                        .collection('users')
                        .insertOne({
                            discord: {
                                ...discordUser,
                                isGitHubAppInstalled: false,
                            },
                        })
                        .then((user: any) => {
                            const mongoId = user.ops[0]._id;
                            // @ts-ignore
                            message.author.send(gitHubAppInstallMsg(mongoId));
                        });
                }
                if (!user.discord.isGitHubAppInstalled) {
                    const mongoId = user._id;
                    // @ts-ignore
                    return message.author.send(gitHubAppInstallMsg(mongoId));
                }
            })
            .catch((err: any) => console.log(err));
    },
};
