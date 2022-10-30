import {ActionRowBuilder, ButtonBuilder, ButtonStyle} from 'discord.js';
import type Game from '@database/models/Game';

export default class PaginatedGamesList {
    games: Game[];
    page: number;
    finalPage: number;
    search: string | undefined;

    public constructor(games: Game[], page: number, finalPage: number, search: string | undefined) {
        this.games = games;
        this.page = page;
        this.finalPage = finalPage;
        this.search = search;
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

    public getButtonRows(buttonType: string): Array<ActionRowBuilder<ButtonBuilder>> {
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
                        type: buttonType,
                        data: {
                            gameId: game.id,
                            page: this.page,
                            search: this.search,
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
                            search: this.search,
                        }}))
                        .setEmoji('⬅️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(this.page === 1),
                    new ButtonBuilder()
                        .setCustomId(JSON.stringify({type: 'page', data: {
                            page: this.page + 1,
                            search: this.search,
                        }}))
                        .setEmoji('➡️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(this.page === this.finalPage),
                ),
        );

        return rows;
    }
}
