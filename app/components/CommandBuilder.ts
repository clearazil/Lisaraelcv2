import type commands from '@config/commands';
import {SlashCommandBuilder} from 'discord.js';

export default class CommandBuilder {
    private readonly commandsList: typeof commands;
    constructor(commandsList: typeof commands) {
        this.commandsList = commandsList;
    }

    public run(): SlashCommandBuilder[] {
        const slashCommands: SlashCommandBuilder[] = [];

        this.commandsList.forEach(command => {
            const commandBuilder: SlashCommandBuilder = new SlashCommandBuilder();

            commandBuilder.setName(command.name)
                .setDescription(command.description)
                .setDefaultMemberPermissions(command.requiredPermissions);

            command.arguments.forEach(argument => {
                if (argument.type === 'Channel') {
                    commandBuilder.addChannelOption(option => option.setName(argument.name)
                        .setDescription(argument.description)
                        .setRequired(argument.required));
                }

                if (argument.type === 'String') {
                    commandBuilder.addStringOption(option => option.setName(argument.name)
                        .setDescription(argument.description)
                        .setRequired(argument.required));
                }
            });

            slashCommands.push(commandBuilder);
        });

        return slashCommands;
    }
}
