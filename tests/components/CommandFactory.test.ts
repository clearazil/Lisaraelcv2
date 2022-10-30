/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-empty-function */
import CommandFactory from '@components/CommandFactory';
import type {ChatInputCommandInteraction} from 'discord.js';
import {test, expect} from '@jest/globals';
import type CommandInterface from '@components/interfaces/CommandInterface';

class SettingCommandMocked implements CommandInterface {
    public hasPermissions() {
        return true;
    }

    run() {}
}
class GameCommandMocked implements CommandInterface {
    public hasPermissions() {
        return true;
    }

    run() {}
}
class SetupCommandMocked implements CommandInterface {
    public hasPermissions() {
        return true;
    }

    run() {}
}

const testMappings = new Map([
    ['SettingCommand', SettingCommandMocked],
    ['GameCommand', GameCommandMocked],
    ['SetupCommand', SetupCommandMocked],
]);

const commands = [
    {
        name: 'test-add-game',
        description: 'Add a game.',
        requiredPermissions: undefined,
        ephemeral: false,
        arguments: [
            {
                name: 'game',
                description: 'The game you want to add.',
                required: true,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
    {
        name: 'test-remove-game',
        description: 'Remove a game.',
        requiredPermissions: undefined,
        ephemeral: false,
        arguments: [
            {
                name: 'game',
                description: 'The game you want to remove.',
                required: true,
                type: 'String',
            },
        ],
        classType: 'GameCommand',
    },
];

const getInteraction = (commandName: string): ChatInputCommandInteraction => ({commandName} as ChatInputCommandInteraction);

test('Instantiates GameCommand', () => {
    const factory = new CommandFactory(testMappings, commands);

    const interaction = getInteraction('test-add-game');
    const command = factory.getCommand(interaction);

    expect(command).toBeInstanceOf(GameCommandMocked);
});

test('Running non-existant command', () => {
    const factory = new CommandFactory(testMappings, commands);

    const interaction = getInteraction('test-add-gamma');

    expect(() => {
        factory.getCommand(interaction);
    }).toThrowError();
});
