import CommandFactory from '@components/CommandFactory';
import type {ChatInputCommandInteraction} from 'discord.js';
import {jest} from '@jest/globals';
import {test, expect} from '@jest/globals';
import GameCommand from '@components/commands/GameCommand';

const interaction: ChatInputCommandInteraction = {commandName: 'add-game'} as ChatInputCommandInteraction;

test('Instantiates GameCommand', () => {
    const factory = new CommandFactory();

    const command = factory.getCommand(interaction);

    expect(command).toBeInstanceOf(GameCommand);
});

