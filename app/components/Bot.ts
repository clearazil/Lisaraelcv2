import {PermissionFlagsBits} from 'discord.js';
import {Events} from 'discord.js';
import {REST, Routes} from 'discord.js';
import config from '@config/general';
import commands from '@config/commands';
import CommandBuilder from './CommandBuilder';
import CommandFactory from './CommandFactory';
import type CommandInterface from './interfaces/CommandInterface';
import Guild from '@database/models/Guild';
import type {Guild as ApiGuild, Client, GuildMember} from 'discord.js';
import ButtonResponseFactory from './ButtonResponseFactory';
import PlayTimeSetter from './PlayTimeSetter';
import {DateTime} from 'luxon';
import Game from '@database/models/Game';
import {Op} from 'sequelize';
import {CronJob} from 'cron';

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

                this.createCron(guild);
            }

            await Promise.all(results);
        });

        this.client.on('guildCreate', async guild => {
            await Guild.createIfNotExists(guild.id, guild.name);

            this.createCron(guild);

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

    private createCron(apiGuild: ApiGuild) {
        const cronJob = new CronJob(
            '0 0 * * SAT',
            () => {
                void this.purge(apiGuild);
            },
            null,
            false,
            'Europe/Amsterdam',
        );

        cronJob.start();
    }

    private async purge(apiGuild: ApiGuild) {
        const guild = await Guild.findOne({
            where: {
                discordGuildId: apiGuild.id,
            },
        });

        if (guild === null) {
            return;
        }

        console.log(`Starting role purge for ${guild.name}...`);

        const date = DateTime.now().minus({days: 7});

        const bot = await apiGuild.members.fetchMe();

        const gameRoles = await Game.findAll({
            where: {
                guildId: guild.id,
                lastUsed: {
                    [Op.or]: {
                        [Op.is]: null,
                        [Op.lt]: date.toFormat('yyyy-MM-dd'),
                    },
                },
                discordRoleId: {
                    [Op.not]: null,
                },
            },
        });

        if (!bot.permissions.has(PermissionFlagsBits.ManageRoles)) {
            console.log('Missing manage roles permission.');
            return;
        }

        const rolePromises: Array<Promise<void>> = [];

        for (const gameRole of gameRoles) {
            rolePromises.push(this.removeRole(gameRole, apiGuild, bot));
        }

        await Promise.all(rolePromises);
    }

    private async removeRole(gameRole: Game, apiGuild: ApiGuild, bot: GuildMember) {
        if (gameRole.discordRoleId !== null) {
            const role = await apiGuild.roles.fetch(gameRole.discordRoleId);

            if (role !== null && bot.roles.highest.comparePositionTo(role) < 1) {
                console.log('Cannot remove role, insufficient permissions.');
                return;
            }

            if (role !== null) {
                await apiGuild.roles.delete(gameRole.discordRoleId);
            }

            gameRole.discordRoleId = null;

            await gameRole.save();
        }
    }
}
