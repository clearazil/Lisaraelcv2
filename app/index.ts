import 'module-alias/register';
import {Client, GatewayIntentBits, Partials} from 'discord.js';
import Discord from '@components/Discord';

const client: Client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const discordClient = new Discord(client);

async function main(): Promise<void> {
	await discordClient.login();
	console.log('logging in');
}

void main();
