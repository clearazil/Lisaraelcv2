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

    public getButtonRows(destinationType: string): Array<ActionRowBuilder<ButtonBuilder>> {
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
                    .setCustomId(this.getCustomId({
                        type: destinationType,
                        destination: destinationType,
                        data: {
                            gameId: game.id,
                            page: this.page,
                            search: this.search,
                        },
                    }))
                    .setLabel(String(number))
                    .setStyle(destinationType === 'ignoreGame' ? ButtonStyle.Danger : ButtonStyle.Success),
            );

            number++;
        }

        rows.push(actionRow);

        rows.push(
            new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId(this.getCustomId({destination: destinationType, type: 'page', data: {
                            page: this.page === 1 ? this.page : this.page - 1,
                            search: this.search,
                        }}))
                        .setEmoji('⬅️')
                        .setStyle(ButtonStyle.Primary)
                        .setDisabled(this.page === 1),
                    new ButtonBuilder()
                        .setCustomId(this.getCustomId({destination: destinationType, type: 'page', data: {
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

    private getCustomId(data: Record<string, unknown>) {
        const encodedData = this.encode(data);
        const dataObj = JSON.stringify(encodedData);

        return dataObj;
    }

    private encode(data: Record<string, unknown>) {
        let encoded = {};
        let number = 1;

        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object' && value !== null) {
                encoded = {...encoded, ...{
                    [number]: this.encode(value as Record<string, unknown>),
                }};
            } else {
                encoded = {...encoded, ...{
                    [number]: value,
                }};
            }

            number++;
        }

        return encoded;
    }
}
