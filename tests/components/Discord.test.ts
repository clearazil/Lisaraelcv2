import Bot from '@components/Bot';
import {jest, test, expect} from '@jest/globals';
import {Client} from 'discord.js';

jest.mock('discord.js');

test('Returns the test sentence', () => {
    const client = new Client({intents: []});
    const bot = new Bot(client);
    expect(bot.testFunction()).toBe('This is a test function');
});
