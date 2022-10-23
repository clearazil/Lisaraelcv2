import type {ChatInputCommandInteraction} from 'discord.js';
import type commands from '@config/commands';

export default class Command {
    protected interaction: ChatInputCommandInteraction;
    protected command: typeof commands[number];

    constructor(interaction: ChatInputCommandInteraction, command: typeof commands[number]) {
        this.interaction = interaction;
        this.command = command;
    }
}
