import ButtonResponse from '@components/ButtonResponse';
import type ButtonResponseInterface from '@components/interfaces/ButtonResponseInterface';
import type PageButton from '@components/types/PageButton';
import PaginatedGamesList from '@components/PaginatedGamesList';
import {EmbedBuilder} from 'discord.js';
import Guild from '@database/models/Guild';
import UserGameSetting from '@database/models/UserGameSetting';

export default class PageResponse extends ButtonResponse implements ButtonResponseInterface {
    public async run() {
        const pageButton: PageButton = this.buttonData.data as PageButton;

        const guild = await Guild.findOne({
            where: {
                discordGuildId: this.interaction.guildId,
            },
        });

        if (guild === null) {
            return;
        }

        console.log(this.interaction);

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

        const rows = gameList.getButtonRows('subscribeGame');

        await this.interaction.update({embeds, components: rows});
    }
}
