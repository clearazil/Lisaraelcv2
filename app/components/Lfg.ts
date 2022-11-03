import Game from '@database/models/Game';
import Guild from '@database/models/Guild';
import type {Collection, Guild as ApiGuild, GuildMember, WebhookEditMessageOptions} from 'discord.js';
import User from '@database/models/User';
import type {ChatInputCommandInteraction} from 'discord.js';
import {Op} from 'sequelize';
import PlayTime from '@database/models/PlayTime';
import UserSetting from '@database/models/UserSetting';
import {DateTime} from 'luxon';
import UserGameSetting from '@database/models/UserGameSetting';
import GameAlias from '@database/models/GameAlias';

export default class Lfg {
    foundRole: boolean;
    foundRolesInMessage: boolean;

    constructor() {
        this.foundRole = false;
        this.foundRolesInMessage = false;
    }

    public async lfg(interaction: ChatInputCommandInteraction, message: string): Promise<WebhookEditMessageOptions | undefined> {
        this.foundRolesInMessage = false;
        let messageReply = message;

        const guild = await Guild.findOne({
            where: {
                discordGuildId: interaction.guildId,
            },
        });

        if (guild === null) {
            return undefined;
        }

        const games = await Game.findAll({
            include: GameAlias,
            order: [
                ['name', 'DESC'],
            ],
            where: {
                guildId: guild.id,
            },
        });

        const apiGuild = interaction.guild;

        if (apiGuild === null) {
            return undefined;
        }

        const gamesWithRoles = await this.getGamesWithRoles(message, games, apiGuild);

        const gameKeys = [];

        for (const game of gamesWithRoles) {
            const regExp = new RegExp(game.name, 'i');

            gameKeys.push(game.id);
            messageReply = messageReply.replace(regExp, game.mention());

            for (const alias of game.GameAliases) {
                const regExp = new RegExp(alias.name, 'i');

                messageReply = messageReply.replace(regExp, game.mention());
            }
        }

        const allMembers = await apiGuild.members.fetch();

        const users = await User.findAll({
            include: [
                PlayTime,
                UserSetting,
                {
                    model: UserGameSetting,
                    where: {
                        gameId: {
                            [Op.in]: gameKeys,
                        },
                    },
                    required: false,
                },
            ],
            where: {
                guildId: guild.id,
                discordUserId: {
                    [Op.in]: Array.from(allMembers.keys()),
                },
            },
        });

        const roleAddPromises = this.addMembersToRoles(users, allMembers, gamesWithRoles);

        await Promise.all(roleAddPromises);

        await interaction.channel?.send(`${interaction.user.username}: ${messageReply}`);

        return {content: 'Your message was posted.'};
    }

    private addMembersToRoles(users: User[], allMembers: Collection<string, GuildMember>, gamesWithRoles: Game[]): Array<Promise<GuildMember>> {
        const roleAddPromises: Array<Promise<GuildMember>> = [];

        for (const user of users) {
            let notifyAllGames = false;

            let notifyAtThisTime = false;
            let timeZone = 'Europe/Amsterdam';

            let dateTime = DateTime.local().setZone(timeZone);

            if (user.UserSetting !== null) {
                notifyAllGames = user.UserSetting.notifyAllGames;

                timeZone = user.UserSetting.timeZone;
                dateTime = dateTime.setZone(timeZone);

                if (user.UserSetting.timeZoneDifference === '+') {
                    dateTime = dateTime.plus({hours: user.UserSetting.timeZoneOffset});
                }

                if (user.UserSetting.timeZoneDifference === '-') {
                    dateTime = dateTime.minus({hours: user.UserSetting.timeZoneOffset});
                }
            }

            let timeStartHms;
            let timeEndHms;

            for (const playTime of user.PlayTimes) {
                timeStartHms = playTime.timeStart.split(':');
                timeEndHms = playTime.timeEnd.split(':');

                const timeStart = dateTime.set({hour: Number(timeStartHms[0]), minute: Number(timeStartHms[1]), second: Number(timeStartHms[2])});
                const timeEnd = dateTime.set({hour: Number(timeEndHms[0]), minute: Number(timeEndHms[1]), second: Number(timeEndHms[2])});

                if (dateTime.toSeconds() > timeStart.toSeconds() && dateTime.toSeconds() < timeEnd.toSeconds()) {
                    notifyAtThisTime = true;
                }
            }

            const member = allMembers.get(user.discordUserId);

            if (member === undefined) {
                continue;
            }

            let addRoleToUser = false;

            for (const game of gamesWithRoles) {
                const gameSetting = user.UserGameSettings.find(element => element.gameId === game.id);

                if (notifyAtThisTime) {
                    if (gameSetting?.notify) {
                        addRoleToUser = true;
                    }

                    if (gameSetting === undefined && notifyAllGames) {
                        addRoleToUser = true;
                    }
                }

                if (game.discordRoleId !== null) {
                    const hasRole = member.roles.cache.has(game.discordRoleId);

                    if (addRoleToUser && !hasRole) {
                        roleAddPromises.push(member.roles.add(game.discordRoleId));
                    }

                    if (!addRoleToUser && hasRole) {
                        roleAddPromises.push(member.roles.remove(game.discordRoleId));
                    }
                }
            }
        }

        return roleAddPromises;
    }

    private async getGamesWithRoles(message: string, games: Game[], apiGuild: ApiGuild): Promise<Game[]> {
        const gamePromises: Array<Promise<Game>> = [];

        for (const game of games) {
            const regExp = new RegExp(game.name, 'i');

            if (message.search(regExp) === -1) {
                for (const alias of game.GameAliases) {
                    const regExp = new RegExp(alias.name, 'i');

                    if (message.search(regExp) !== -1) {
                        gamePromises.push(this.getGameWithRole(game, apiGuild));
                    }
                }
            } else {
                gamePromises.push(this.getGameWithRole(game, apiGuild));
            }
        }

        return Promise.all(gamePromises);
    }

    private async getGameWithRole(game: Game, apiGuild: ApiGuild): Promise<Game> {
        game.lastUsed = DateTime.now();
        if (game.discordRoleId === null || !apiGuild.roles.cache.has(game.discordRoleId)) {
            return apiGuild.roles.create({
                name: game.name,
                color: '#3498db',
            }).then(async role => {
                game.discordRoleId = role.id;

                return game.save();
            });
        }

        return game.save();
    }
}
