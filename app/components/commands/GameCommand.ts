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

        if (this.interaction.commandName === 'ignore-games') {
            console.log('Running ignore-games command...');

            const search = this.interaction.options.getString('search') ?? undefined;

            void this.ignoreGames(search);
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
        await this.gameListing(search, 'subscribeGame');
    }

    public async ignoreGames(search: string | undefined) {
        await this.gameListing(search, 'ignoreGame');
    }

    private async gameListing(search: string | undefined, type: string) {
        if (search !== undefined && search.length > 30) {
            await this.interaction.reply({content: 'Your search cannot be longer than 30 characters.'});
            return;
        }

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
        const rows = gameList.getButtonRows(type);

        const embeds = [
            new EmbedBuilder()
                .setColor(0x0099FF)
                .setDescription(description),
        ];

        let interactionContent = '';

        if (type === 'ignoreGame') {
            interactionContent += 'Choose games to ignore';
        } else {
            interactionContent += 'Choose games to subscribe to:';
        }

        await this.interaction.reply({
            content: interactionContent,
            embeds,
            components: rows,
            ephemeral: this.command.ephemeral,
        });
    }
}
