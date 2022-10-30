import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class PlayTime extends Model {
    declare id: number;
    declare guildId: number;
    declare emoji: string;
    declare timeStart: string;
    declare timeEnd: string;
}

PlayTime.init({
    guildId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    emoji: DataTypes.STRING,
    timeStart: DataTypes.TIME,
    timeEnd: DataTypes.TIME,
}, {
    sequelize,
    modelName: 'PlayTime',
});

export default PlayTime;
