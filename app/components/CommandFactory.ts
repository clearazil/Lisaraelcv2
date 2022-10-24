import type {ChatInputCommandInteraction} from 'discord.js';
import type CommandInterface from './interfaces/CommandInterface';
import GameCommand from './commands/GameCommand';
import SettingCommand from './commands/SettingCommand';
import SetupCommand from './commands/SetupCommand';
import commands from '@config/commands';

export default class CommandFactory {
    public getCommand(interaction: ChatInputCommandInteraction): CommandInterface {
        for (const command of commands) {
            if (command.name === interaction.commandName) {
                if (command.classType === 'SettingCommand') {
                    return new SettingCommand(interaction, command);
                }

                if (command.classType === 'GameCommand') {
                    return new GameCommand(interaction, command);
                }

                if (command.classType === 'SetupCommand') {
                    return new SetupCommand(interaction, command);
                }
            }
        }

        throw new Error(`Unexpected '${interaction.commandName}' command.`);
    }
}
