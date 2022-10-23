import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';

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

export default Game;
