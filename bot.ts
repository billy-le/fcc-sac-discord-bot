import Discord from 'discord.js';
import { CommandStore } from './CommandStore';

const PREFIX = '!';

const { DISCORD_TOKEN } = process.env;

const client: any = new Discord.Client();
client.commands = CommandStore.getInstance().getCommands();

client.on('message', (message: any) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) {
        return;
    }

    const args = message.content.slice(PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) {
        return;
    }

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.login(DISCORD_TOKEN);

export default client;
