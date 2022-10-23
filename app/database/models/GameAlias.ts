import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class GameAlias extends Model {}

GameAlias.init({
    guildId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    name: DataTypes.STRING,
}, {
    sequelize,
    modelName: 'GameAlias',
});

export default GameAlias;
