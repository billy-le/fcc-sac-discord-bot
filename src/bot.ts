import { CommandStore } from './CommandStore';
import config from '../config';
import Discord from 'discord.js';

const client: any = new Discord.Client();
client.commands = CommandStore.getInstance().getCommands();

client.login(config.discord.token);

export default client;
