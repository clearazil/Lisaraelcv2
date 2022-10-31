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

    public getResponse(interaction: MessageComponentInteraction): ButtonResponseInterface {
        let buttonData;

        try {
            const dataRaw = JSON.parse(interaction.customId) as ButtonDataRaw;

            buttonData = {
                destination: dataRaw[1],
                type: dataRaw[2],
                data: dataRaw[3],
            };
        } catch (error: unknown) {
            buttonData = undefined;
        }

        if (buttonData !== undefined) {
            const constructor = this.buttonDataMap.get(buttonData.type);

            if (constructor) {
                return new constructor(interaction, buttonData);
            }
        }

        throw new Error(`Unexpected customId: '${interaction.customId}'.`);
    }
}
