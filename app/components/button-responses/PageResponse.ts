import ButtonResponse from '@components/ButtonResponse';
import type ButtonResponseInterface from '@components/interfaces/ButtonResponseInterface';
import type PageButton from '@components/types/buttons/PageButton';
import PaginatedGamesList from '@components/PaginatedGamesList';
import {EmbedBuilder} from 'discord.js';
import Guild from '@database/models/Guild';
import UserGameSetting from '@database/models/UserGameSetting';
import type PageButtonRaw from '@components/types/buttons/PageButtonRaw';

export default class PageResponse extends ButtonResponse implements ButtonResponseInterface {
    public async run() {
        const rawData = this.buttonData.data as PageButtonRaw;
        const pageButton: PageButton = {
            page: rawData[1],
            search: rawData[2],
        };

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
            pageButton.page,
            {
                model: UserGameSetting,
                where: {
                    userId: user.id,
                },
                required: false,
            },
            pageButton.search,
        );

        const gameList = new PaginatedGamesList(pageData.games, pageData.currentPage, pageData.finalPage, pageButton.search);

        if (gameList === undefined) {
            return;
        }

        const description = gameList.getDescription();

        const embeds = [
            new EmbedBuilder()
                .setColor(0x0099FF)
                .setDescription(description),
        ];

        const rows = gameList.getButtonRows(this.buttonData.destination);

        await this.interaction.update({embeds, components: rows});
    }
}
