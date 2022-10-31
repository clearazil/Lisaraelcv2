import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import type Game from './Game';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class GameAlias extends Model {
    declare id: number;
    declare guildId: number;
    declare gameId: number;
    declare name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    declare Game: Game;
}

GameAlias.init({
    guildId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    name: DataTypes.STRING,
}, {
    sequelize,
    modelName: 'GameAlias',
});

export default GameAlias;
