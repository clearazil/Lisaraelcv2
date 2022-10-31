import type {ChatInputCommandInteraction} from 'discord.js';
import type CommandInterface from './interfaces/CommandInterface';
import GameCommand from './commands/GameCommand';
import SettingCommand from './commands/SettingCommand';
import commands from '@config/commands';
import type Command from './types/Command';

// Interface which tells the common constructor
type CommandInterfaceConstructor = new (interaction: ChatInputCommandInteraction, command: Command) => CommandInterface;

const defaultCommandMapping = new Map<string, CommandInterfaceConstructor>([
    ['SettingCommand', SettingCommand],
    ['GameCommand', GameCommand],
]);

export default class CommandFactory {
    constructor(
        readonly commandMap = defaultCommandMapping,
        readonly commandsConfig = commands,
    ) {}

    public getCommand(interaction: ChatInputCommandInteraction): CommandInterface {
        const commandConfig = this.commandsConfig.find(command => command.name === interaction.commandName);

        if (commandConfig) {
            const constructor = this.commandMap.get(commandConfig.classType);

            if (constructor) {
                return new constructor(interaction, commandConfig);
            }
        }

        throw new Error(`Unexpected '${interaction.commandName}' command.`);
    }
}
