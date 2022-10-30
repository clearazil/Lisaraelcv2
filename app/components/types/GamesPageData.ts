import type Game from '@database/models/Game';

type GamesPageData = {
        games: Game[];
        currentPage: number;
        finalPage: number;
};

export default GamesPageData;
