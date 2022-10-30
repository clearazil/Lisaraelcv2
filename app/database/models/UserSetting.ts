import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class UserSetting extends Model {
    declare id: number;
    declare userId: number;
    declare timeZone: string;
    declare timeZoneDifference: string;
    declare timeZoneOffset: string;
    declare notifyAllGames: boolean;
}

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

export default UserSetting;
