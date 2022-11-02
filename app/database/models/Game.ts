import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import type UserGameSetting from './UserGameSetting';
import type {DateTime} from 'luxon';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class Game extends Model {
    declare id: number;
    declare name: string;
    declare discordRoleId: string;
    declare lastUsed: string | DateTime;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    declare UserGameSettings: UserGameSetting[];
    // eslint-disable-next-line @typescript-eslint/naming-convention
    declare GameAliases: Game[];

    mention(): string {
        return `<@&${this.discordRoleId}>`;
    }
}

Game.init({
    guildId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    discordRoleId: DataTypes.STRING,
    lastUsed: DataTypes.DATE,
}, {
    sequelize,
    modelName: 'Game',
});

export default Game;
