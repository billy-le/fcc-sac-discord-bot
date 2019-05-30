import { Message } from 'discord.js';

module.exports = {
    name: 'github-helper',
    description: '',
    execute(message: Message, _args: string[]) {
        message.author.send(
            `Hello! Please follow the link to get some basics features for your Github account. It will listen to different events like when you are creating a new repo, an issue, or even ask the community for a code review on your pull request! freeCodeCamp Sacramento Community! https://github.com/apps/fcc-sac-discord-bot/installations/new`
        );
    },
};
