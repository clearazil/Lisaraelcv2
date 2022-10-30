/* eslint-disable @typescript-eslint/consistent-type-assertions */
/* eslint-disable @typescript-eslint/no-empty-function */
import {test, expect} from '@jest/globals';
import type ButtonResponseInterface from '@components/interfaces/ButtonResponseInterface';
import ButtonResponseFactory from '@components/ButtonResponseFactory';
import type {MessageComponentInteraction} from 'discord.js';

class GameResponseMocked implements ButtonResponseInterface {
    run() {}
}
class PageResponseMocked implements ButtonResponseInterface {
    run() {}
}

const testMappings = new Map([
    ['game-response', GameResponseMocked],
    ['page-response', PageResponseMocked],
]);

const getInteraction = (customId: string): MessageComponentInteraction => ({customId} as MessageComponentInteraction);

test('Instantiates GameResponse', () => {
    const factory = new ButtonResponseFactory(testMappings);

    const interaction = getInteraction(JSON.stringify({
        type: 'game-response',
    }));
    const command = factory.getResponse(interaction);

    expect(command).toBeInstanceOf(GameResponseMocked);
});

test('Running non-existant command', () => {
    const factory = new ButtonResponseFactory(testMappings);

    const interaction = getInteraction('game-responze');

    expect(() => {
        factory.getResponse(interaction);
    }).toThrowError();
});
