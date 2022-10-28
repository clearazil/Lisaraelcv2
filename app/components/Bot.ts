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
import GameLister from './GameLister';
import type SubscribeGameButton from './types/SubscribeGameButton';

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

                try {
                    const buttonData: ButtonData = JSON.parse(interaction.customId) as ButtonData;

                    if (buttonData.type === 'subscribeGame') {
                        const subscribeButton: SubscribeGameButton = buttonData.data as SubscribeGameButton;

                        const gameList = await GameLister.createGameLister(interaction, subscribeButton.page);

                        if (gameList === undefined) {
                            return;
                        }

                        await gameList.subscribeGame(subscribeButton.gameId);

                        const description = gameList.getDescription();

                        const embeds = [
                            new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setDescription(description),
                        ];

                        await interaction.update({embeds});
                    }

                    if (buttonData.type === 'page') {
                        const pageButton: PageButton = buttonData.data as PageButton;

                        const gameList = await GameLister.createGameLister(interaction, pageButton.page);

                        if (gameList === undefined) {
                            return;
                        }

                        const description = gameList.getDescription();

                        const embeds = [
                            new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setDescription(description),
                        ];

                        const rows = gameList.getActionRows();

                        await interaction.update({embeds, components: rows});
                    }
                } catch (error: unknown) {
                    console.log(error);
                }
            }
        });
    }
}

