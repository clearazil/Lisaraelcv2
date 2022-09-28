import Discord from '@components/Discord';
import {jest, test, expect} from '@jest/globals';
import {Client} from 'discord.js';

jest.mock('discord.js');

test('Returns the test sentence', () => {
    const client = new Client({intents: []});
    const discordClient = new Discord(client);
    expect(discordClient.testFunction()).toBe('This is a test function');
});
