import type {MessageComponentInteraction} from 'discord.js';
import type ButtonData from './types/ButtonData';

export default class ButtonResponse {
    interaction: MessageComponentInteraction;
    buttonData: ButtonData;

    public constructor(interaction: MessageComponentInteraction, buttonData: ButtonData) {
        this.interaction = interaction;
        this.buttonData = buttonData;
    }
}
