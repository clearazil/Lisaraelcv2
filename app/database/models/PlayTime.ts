import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import User from './User';
import Guild from './Guild';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class PlayTime extends Model {}

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

PlayTime.belongsToMany(User, {through: 'PlayTimeUser'});
PlayTime.belongsTo(Guild);

export default PlayTime;
