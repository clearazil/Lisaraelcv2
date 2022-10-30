import type {ChatInputCommandInteraction} from 'discord.js';
import type CommandInterface from './interfaces/CommandInterface';
import type {MessageComponentInteraction} from 'discord.js';
import commands from '@config/commands';
import type Command from './types/Command';
import GameResponse from './button-responses/GameResponse';
import type ButtonResponseInterface from './interfaces/ButtonResponseInterface';
import type ButtonData from './types/ButtonData';
import PageResponse from './button-responses/PageResponse';

// Interface which tells the common constructor
type ButtonResponseInterfaceConstructor = new (interaction: MessageComponentInteraction, buttonData: ButtonData) => ButtonResponseInterface;

const defaultButtonDataMapping = new Map<string, ButtonResponseInterfaceConstructor>([
    ['subscribeGame', GameResponse],
    ['page', PageResponse],
]);

export default class ButtonResponseFactory {
    constructor(
        readonly buttonDataMap = defaultButtonDataMapping,
    ) {}

    public getResponse(interaction: MessageComponentInteraction): ButtonResponseInterface {
        let buttonData;

        try {
            buttonData = JSON.parse(interaction.customId) as ButtonData;
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
