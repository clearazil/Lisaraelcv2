import type {Client} from 'discord.js';
import {Events} from 'discord.js';
import {REST, Routes} from 'discord.js';
import config from '@config/general';
import type commands from '@config/commands';
import CommandBuilder from './CommandBuilder';
import CommandFactory from './CommandFactory';
import type CommandInterface from './interfaces/CommandInterface';
import Guild from '@database/models/Guild';
import type ButtonData from './types/ButtonData';
import type PageButton from './types/PageButton';
import {EmbedBuilder} from 'discord.js';
import GameLister from './PaginatedGamesList';
import type SubscribeGameButton from './types/SubscribeGameButton';
import ButtonResponseFactory from './ButtonResponseFactory';
import type ButtonResponseInterface from './interfaces/ButtonResponseInterface';
import PlayTimeUser from '@database/models/PlayTimeUser';
import PlayTimeSetter from './PlayTimeSetter';
import PlayTime from '@database/models/PlayTime';

/**
 *
 */
export default class Bot {
    private readonly client: Client;

    constructor(client: Client) {
        this.client = client;
    }

    public async login() {
        await this.client.login(config.discord.token);
    }

    public async saveGuilds() {
        this.client.once('ready', async () => {
            const results = [];
            for (const guild of this.client.guilds.cache.values()) {
                results.push(Guild.createIfNotExists(guild.id, guild.name));
            }

            await Promise.all(results);
        });

        this.client.on('guildCreate', async guild => {
            await Guild.createIfNotExists(guild.id, guild.name);
        });
    }

    public async registerCommands(commandsList: typeof commands) {
        const slashCommands = new CommandBuilder(commandsList).run();
        const rest = new REST({version: '10'}).setToken(config.discord.token);

        this.client.once('ready', async () => {
            const results = [];
            for (const guild of this.client.guilds.cache.values()) {
                results.push(rest.put(
                    Routes.applicationGuildCommands(config.discord.appId, guild.id), {body: slashCommands},
                ));
            }

            await Promise.all(results);
        });
    }

    public respondToInteractions() {
        this.client.on(Events.InteractionCreate, async interaction => {
            if (interaction.isChatInputCommand()) {
                const command: CommandInterface = new CommandFactory().getCommand(interaction);
                command.run();
            }

            if (interaction.isButton()) {
                console.log('Responding to button interaction...');

                const buttonResponse: ButtonResponseInterface = new ButtonResponseFactory().getResponse(interaction);
                buttonResponse.run();
            }

            if (interaction.isSelectMenu()) {
                console.log('Responding to select menu interaction...');

                if (interaction.customId === 'set-play-times') {
                    console.log('Responding to set-play-times select menu...');
                    const setter = new PlayTimeSetter();
                    const options = await setter.getUpdateOptions(interaction);

                    if (options === undefined) {
                        return;
                    }

                    await interaction.update(options);
                }
            }
        });
    }
}

