import type {MessageComponentInteraction, ChatInputCommandInteraction} from 'discord.js';
import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import Guild from '@database/models/Guild';
import Game from '@database/models/Game';
import UserGameSetting from '@database/models/UserGameSetting';
import User from '@database/models/User';

export default class GameLister {
    public static async createGameLister(interaction: ChatInputCommandInteraction | MessageComponentInteraction, page = 1): Promise<GameLister | undefined> {
        const self = new GameLister(interaction, page);
        const guild = await Guild.findOne({
            where: {
                discordGuildId: interaction.guildId,
            },
        });

        if (guild !== null) {
            self.guild = guild;

            let user = await User.findOne({
                where: {
                    discordUserId: interaction.user.id,
                    guildId: guild.id,
                },
            });

            if (user === null) {
                user = await User.create({
                    discordUserId: interaction.user.id,
                    name: interaction.user.username,
                    guildId: guild.id,
                });
            }

            const games = await Game.findAll({
                where: {
                    guildId: guild.id,
                },
                include: {
                    model: UserGameSetting,
                    where: {
                        userId: user.id,
                    },
                    required: false,
                },
                limit: 10,
                offset: (page - 1) * self.offset,
            });

            self.games = games;

            const count = await Game.count({
                where: {
                    guildId: guild.id,
                },
            });

            self.gamesCount = count;
        }

        if (self.games.length < 1) {
            return undefined;
        }

        return self;
    }

    interaction: ChatInputCommandInteraction | MessageComponentInteraction;
    page: number;
    games: Game[] = [];
    gamesCount = 0;
    offset = 10;
    guild: Guild | undefined = undefined;

    private constructor(interaction: ChatInputCommandInteraction | MessageComponentInteraction, page: number) {
        this.page = page;
        this.interaction = interaction;
    }

    public getDescription(): string {
        let description = '';
        let number = 1;

        for (const game of this.games) {
            description += `${number}. ${game.name}`;

            for (const userGameSetting of game.UserGameSettings) {
                if (userGameSetting.notify === true) {
                    description += ' ✅';
                }

                if (userGameSetting.notify === false) {
                    description += ' ❌';
                }
            }

            description += '\n';

            number++;
        }

        return description;
    }

    public getActionRows(): Array<ActionRowBuilder<ButtonBuilder>> {
        const nextOffset = this.page * this.offset;

        const rows: Array<ActionRowBuilder<ButtonBuilder>> = [];

        let number = 1;

        let actionRow = new ActionRowBuilder<ButtonBuilder>();
        for (const game of this.games) {
            if (number === 6) {
                rows.push(actionRow);
                actionRow = new ActionRowBuilder();
            }

            actionRow.addComponents(
                new ButtonBuilder()
                    .setCustomId(JSON.stringify({
                        type: 'subscribeGame',
                        data: {
                            gameId: game.id,
                            page: this.page,
                        },
                    }))
                    .setLabel(String(number))
                    .setStyle(ButtonStyle.Success),
            );

            number++;
        }

        rows.push(actionRow);

        rows.push(
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(JSON.stringify({type: 'page', data: {
                            page: this.page === 1 ? this.page : this.page - 1,
                        }}))
                        .setEmoji('⬅️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(this.page === 1),
                    new ButtonBuilder()
                        .setCustomId(JSON.stringify({type: 'page', data: {
                            page: this.page + 1,
                        }}))
                        .setEmoji('➡️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(nextOffset > this.gamesCount),
                ),
        );

        return rows;
    }

    public async subscribeGame(gameId: number) {
        if (this.guild === undefined) {
            return;
        }

        let user = await User.findOne({
            where: {
                discordUserId: this.interaction.user.id,
                guildId: this.guild.id,
            },
        });

        if (user === null) {
            user = await User.create({
                discordUserId: this.interaction.user.id,
                name: this.interaction.user.username,
                guildId: this.guild.id,
            });
        }

        const userGameSetting = await UserGameSetting.findOne({
            where: {
                userId: user.id,
                gameId,
            },
        });

        if (userGameSetting === null) {
            await UserGameSetting.create({
                userId: user.id,
                gameId,
                notify: true,
            });
        } else if (userGameSetting.notify) {
            await userGameSetting.destroy();
        } else {
            userGameSetting.notify = true;
            await userGameSetting.save();
        }

        this.games = await Game.findAll({
            where: {
                guildId: this.guild.id,
            },
            include: {
                model: UserGameSetting,
                where: {
                    userId: user.id,
                },
                required: false,
            },
            limit: 10,
            offset: (this.page - 1) * this.offset,
        });
    }
}
