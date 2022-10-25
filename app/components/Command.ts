import type {ChatInputCommandInteraction} from 'discord.js';
import type {default as CommandType} from './types/Command';

export default class Command {
    protected interaction: ChatInputCommandInteraction;
    protected command: CommandType;

    constructor(interaction: ChatInputCommandInteraction, command: CommandType) {
        this.interaction = interaction;
        this.command = command;
    }
}
