import ButtonResponse from '@components/ButtonResponse';
import type ButtonResponseInterface from '@components/interfaces/ButtonResponseInterface';
import type SubscribeGameButton from '@components/types/buttons/SubscribeGameButton';
import PaginatedGamesList from '@components/PaginatedGamesList';
import {EmbedBuilder} from 'discord.js';
import Guild from '@database/models/Guild';
import UserGameSetting from '@database/models/UserGameSetting';
import type User from '@database/models/User';
import type SubscribeGameButtonRaw from '@components/types/buttons/SubscribeGameButtonRaw';
import Game from '@database/models/Game';

export default class GameResponse extends ButtonResponse implements ButtonResponseInterface {
    public async run() {
        const rawData = this.buttonData.data as SubscribeGameButtonRaw;
        const subscribeButton: SubscribeGameButton = {
            gameId: rawData[1],
            page: rawData[2],
            search: rawData[3],
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
        const notify = this.buttonData.destination !== 'ignoreGame';

        if (!await this.setUserNotify(user, subscribeButton.gameId, notify)) {
            return;
        }

        const pageData = await guild.paginatedGuildGames(
            subscribeButton.page,
            {
                model: UserGameSetting,
                where: {
                    userId: user.id,
                },
                required: false,
            },
            subscribeButton.search,
        );

        const gameList = new PaginatedGamesList(pageData.games, pageData.currentPage, pageData.finalPage, subscribeButton.search);
        const description = gameList.getDescription();

        const embeds = [
            new EmbedBuilder()
                .setColor(0x0099FF)
                .setDescription(description),
        ];

        await this.interaction.update({embeds});
    }

    public async setUserNotify(user: User, gameId: number, notify: boolean) {
        const userGameSetting = await UserGameSetting.findOne({
            where: {
                userId: user.id,
                gameId,
            },
        });

        if (userGameSetting === null) {
            const game = await Game.findOne({where: {id: gameId}});

            if (game === null) {
                return false;
            }

            await UserGameSetting.create({
                userId: user.id,
                gameId,
                notify,
            });
        } else if (userGameSetting.notify === notify) {
            await userGameSetting.destroy();
        } else {
            userGameSetting.notify = notify;
            await userGameSetting.save();
        }

        return true;
    }
}
