import 'module-alias/register';
import {Client, GatewayIntentBits, Partials} from 'discord.js';
import Bot from '@components/Bot';
import commands from '@config/commands';

const client: Client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const bot = new Bot(client);

async function main(): Promise<void> {
    console.log('logging in...');
    await bot.login();
    console.log('registering commands...');
    await bot.registerCommands(commands);
}

void main();
