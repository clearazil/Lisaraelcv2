import CommandBuilder from '@components/CommandBuilder';
import commands from '@config/commands';
import {test, expect} from '@jest/globals';

test('Results of run method is an array', () => {
    const builtCommands = new CommandBuilder(commands).run();

    expect(Array.isArray(builtCommands)).toBe(true);
});
