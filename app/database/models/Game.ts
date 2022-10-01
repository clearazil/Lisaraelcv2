import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import GameAlias from './GameAlias';
import UserGameSetting from './UserGameSetting';
import Guild from './Guild';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class Game extends Model {
    discordRoleId = '';
    mention(): string {
        return `<@&${this.discordRoleId}>`;
    }
}

Game.init({
    guildId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    discordRoleId: DataTypes.STRING,
    discordMessageId: DataTypes.STRING,
    lastUsed: DataTypes.DATE,
}, {
    sequelize,
    modelName: 'Game',
});

Game.hasMany(GameAlias, {onDelete: 'CASCADE'});
Game.hasMany(UserGameSetting, {onDelete: 'CASCADE'});
Game.belongsTo(Guild);

export default Game;
