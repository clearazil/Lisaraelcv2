import 'module-alias/register';
import {Client, GatewayIntentBits, Partials} from 'discord.js';
import Bot from '@components/Bot';
import commands from '@config/commands';
import associate from '@database/associate';

associate();

const client: Client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const bot = new Bot(client);

async function main(): Promise<void> {
    console.log('logging in...');
    await bot.login();
    console.log('adding new guild(s) to the database...');
    await bot.saveGuilds();
    console.log('registering commands...');
    await bot.registerCommands();
    console.log('responding to interactions...');
    bot.respondToInteractions();
}

void main();
