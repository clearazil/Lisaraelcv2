import ButtonResponse from '@components/ButtonResponse';
import type ButtonResponseInterface from '@components/interfaces/ButtonResponseInterface';
import type SubscribeGameButton from '@components/types/SubscribeGameButton';
import PaginatedGamesList from '@components/PaginatedGamesList';
import {EmbedBuilder} from 'discord.js';
import Guild from '@database/models/Guild';
import UserGameSetting from '@database/models/UserGameSetting';
import type User from '@database/models/User';

export default class GameResponse extends ButtonResponse implements ButtonResponseInterface {
    public async run() {
        const subscribeButton: SubscribeGameButton = this.buttonData.data as SubscribeGameButton;

        const guild = await Guild.findOne({
            where: {
                discordGuildId: this.interaction.guildId,
            },
        });

        if (guild === null) {
            return;
        }

        const user = await guild.getGuildUser(this.interaction.user.id, this.interaction.user.username);

        await this.subscribeUserToGame(user, subscribeButton.gameId);

        const pageData = await guild.paginatedGuildGames(
            subscribeButton.page,
            {
                model: UserGameSetting,
                where: {
                    userId: user.id,
                },
                required: false,
            },
        );

        const gameList = new PaginatedGamesList(pageData.games, pageData.currentPage, pageData.finalPage);
        const description = gameList.getDescription();

        const embeds = [
            new EmbedBuilder()
                .setColor(0x0099FF)
                .setDescription(description),
        ];

        await this.interaction.update({embeds});
    }

    public async subscribeUserToGame(user: User, gameId: number) {
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
    }
}
