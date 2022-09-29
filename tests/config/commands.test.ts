import commands from '@config/commands';
import {test, expect} from '@jest/globals';

test('All the required properties in commands config exists', () => {
    commands.forEach(command => {
        expect(command).toHaveProperty('name');
        expect(command).toHaveProperty('description');
        expect(command).toHaveProperty('requiredPermissions');
        expect(command).toHaveProperty('ephemeral');
        expect(command).toHaveProperty('arguments');

        command.arguments.forEach(argument => {
            expect(argument).toHaveProperty('name');
            expect(argument).toHaveProperty('description');
            expect(argument).toHaveProperty('required');
            expect(argument).toHaveProperty('type');
        });
    });
});
