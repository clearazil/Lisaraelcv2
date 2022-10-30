import Command from '@components/Command';
import type CommandInterface from '../interfaces/CommandInterface';
import {EmbedBuilder} from 'discord.js';
import Guild from '@database/models/Guild';
import PaginatedGamesList from '@components/PaginatedGamesList';
import UserGameSetting from '@database/models/UserGameSetting';
import Game from '@database/models/Game';

export default class GameCommand extends Command implements CommandInterface {
    public run() {
        if (this.interaction.commandName === 'add-game') {
            console.log('Running add-game command...');

            const game = this.interaction.options.getString('game') ?? '';

            void this.addGame(game);
        }

        if (this.interaction.commandName === 'games') {
            console.log('Running games command...');

            const search = this.interaction.options.getString('search') ?? undefined;

            void this.listGames(search);
        }
    }

    public hasPermissions() {
        return true;
    }

    public async addGame(game: string) {
        const guild = await Guild.findOne({
            where: {
                discordGuildId: this.interaction.guildId,
            },
        });

        if (guild === null) {
            return;
        }

        const exists = await Game.findOne({
            where: {
                guildId: guild.id,
                name: game,
            },
        }) !== null;

        if (exists) {
            await this.interaction.reply({
                content: `${game} has already been added.`,
                ephemeral: this.command.ephemeral,
            });

            return;
        }

        await Game.create({
            guildId: guild.id,
            name: game,
            discordRoleId: null,
        });

        await this.interaction.reply({
            content: `${game} has been added.`,
            ephemeral: this.command.ephemeral,
        });
    }

    public async listGames(search: string | undefined) {
        const guild = await Guild.findOne({
            where: {
                discordGuildId: this.interaction.guildId,
            },
        });

        if (guild === null) {
            return;
        }

        const user = await guild.getGuildUser(this.interaction.user.id, this.interaction.user.username);

        const pageData = await guild.paginatedGuildGames(
            1,
            {
                model: UserGameSetting,
                where: {
                    userId: user.id,
                },
                required: false,
            },
            search,
        );

        if (pageData.games.length < 1) {
            if (search !== undefined) {
                await this.interaction.reply({
                    content: `Your search for "${search}" did not return any results.`,
                    ephemeral: this.command.ephemeral,
                });
                return;
            }

            await this.interaction.reply({
                content: 'This server doesn\'t have any games! Ask a moderator to add some.',
                ephemeral: this.command.ephemeral,
            });
            return;
        }

        const gameList = new PaginatedGamesList(pageData.games, pageData.currentPage, pageData.finalPage, search);

        const description = gameList.getDescription();
        const rows = gameList.getButtonRows('subscribeGame');

        const embeds = [
            new EmbedBuilder()
                .setColor(0x0099FF)
                .setDescription(description),
        ];

        await this.interaction.reply({
            content: 'Choose games to subscribe to:',
            embeds,
            components: rows,
            ephemeral: this.command.ephemeral,
        });
    }
}
