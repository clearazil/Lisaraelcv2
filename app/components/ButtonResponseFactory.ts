import type {MessageComponentInteraction} from 'discord.js';
import GameResponse from './button-responses/GameResponse';
import type ButtonResponseInterface from './interfaces/ButtonResponseInterface';
import type ButtonData from './types/buttons/ButtonData';
import PageResponse from './button-responses/PageResponse';
import type ButtonDataRaw from './types/buttons/ButtonDataRaw';

// Interface which tells the common constructor
type ButtonResponseInterfaceConstructor = new (interaction: MessageComponentInteraction, buttonData: ButtonData) => ButtonResponseInterface;

const defaultButtonDataMapping = new Map<string, ButtonResponseInterfaceConstructor>([
    ['subscribeGame', GameResponse],
    ['ignoreGame', GameResponse],
    ['page', PageResponse],
]);

export default class ButtonResponseFactory {
    constructor(
        readonly buttonDataMap = defaultButtonDataMapping,
    ) {}

    public getResponse(interaction: MessageComponentInteraction): ButtonResponseInterface | undefined {
        let buttonData;

        const dataRaw = this.convertFromJson(interaction.customId) as ButtonDataRaw;

        if (!this.checkRawData(dataRaw)) {
            return;
        }

        if (dataRaw !== undefined) {
            buttonData = {
                destination: dataRaw[1],
                type: dataRaw[2],
                data: dataRaw[3],
            };

            const constructor = this.buttonDataMap.get(buttonData.type);

            if (constructor) {
                return new constructor(interaction, buttonData);
            }
        }

        throw new Error(`Unexpected customId: '${interaction.customId}'.`);
    }

    private convertFromJson(data: string) {
        try {
            return JSON.parse(data) as Record<string, unknown>;
        } catch (error: unknown) {
            return undefined;
        }
    }

    private checkRawData(rawData: Record<string, unknown>): boolean {
        return rawData[1] !== undefined && rawData[2] !== undefined && rawData[3] !== undefined;
    }
}
