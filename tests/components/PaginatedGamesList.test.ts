
import PaginatedGamesList from '@components/PaginatedGamesList';
import type Game from '@database/models/Game';
import type UserGameSetting from '@database/models/UserGameSetting';
import {test, expect} from '@jest/globals';

const games = [
    {
        name: 'Game1',
        id: 11,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        UserGameSettings: [
            {
                notify: true,
            } as unknown as UserGameSetting,
        ],
    } as unknown as Game,
];

const gameList = new PaginatedGamesList(games, 1, 10);

test('getDescription returns string', () => {
    expect(typeof gameList.getDescription()).toBe('string');
});

test('getButtonRows returns array', () => {
    expect(Array.isArray(gameList.getButtonRows('buttonType'))).toBe(true);
});
