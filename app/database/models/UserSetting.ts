import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import User from './User';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class UserSetting extends Model {}

UserSetting.init({
    userId: DataTypes.STRING,
    timeZone: DataTypes.STRING,
    timeZoneDifference: DataTypes.STRING,
    timeZoneOffset: DataTypes.INTEGER,
    notifyAllGames: DataTypes.BOOLEAN,
}, {
    sequelize,
    modelName: 'UserSetting',
});

UserSetting.belongsTo(User);

export default UserSetting;
