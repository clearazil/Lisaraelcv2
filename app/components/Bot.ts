import type {Client} from 'discord.js';
import {Events} from 'discord.js';
import {REST, Routes} from 'discord.js';
import config from '@config/general';
import commands from '@config/commands';
import CommandBuilder from './CommandBuilder';
import CommandFactory from './CommandFactory';
import type CommandInterface from './interfaces/CommandInterface';
import Guild from '@database/models/Guild';
import type {Guild as ApiGuild} from 'discord.js';
import ButtonResponseFactory from './ButtonResponseFactory';
import type ButtonResponseInterface from './interfaces/ButtonResponseInterface';
import PlayTimeSetter from './PlayTimeSetter';

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

            await this.registerGuildCommands(guild);
        });
    }

    public async registerGuildCommands(apiGuild: ApiGuild) {
        const slashCommands = new CommandBuilder(commands).run();
        const rest = new REST({version: '10'}).setToken(config.discord.token);

        return rest.put(
            Routes.applicationGuildCommands(config.discord.appId, apiGuild.id), {body: slashCommands},
        );
    }

    public async registerCommands() {
        this.client.once('ready', async () => {
            const results = [];
            for (const guild of this.client.guilds.cache.values()) {
                results.push(this.registerGuildCommands(guild));
            }

            await Promise.all(results);
        });
    }

    public respondToInteractions() {
        this.client.on(Events.InteractionCreate, async interaction => {
            if (interaction.isChatInputCommand()) {
                const command: CommandInterface = new CommandFactory().getCommand(interaction);

                const hasPermissions = await command.hasPermissions();
                if (hasPermissions) {
                    command.run();
                }
            }

            if (interaction.isButton()) {
                console.log('Responding to button interaction...');

                const buttonResponse = new ButtonResponseFactory().getResponse(interaction);
                buttonResponse?.run();
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

