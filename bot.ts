import Discord from 'discord.js';
import { CommandStore } from './CommandStore';

const { DISCORD_TOKEN } = process.env;

const client: any = new Discord.Client();
client.commands = CommandStore.getInstance().getCommands();

client.login(DISCORD_TOKEN);

export default client;
