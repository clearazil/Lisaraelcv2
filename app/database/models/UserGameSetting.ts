import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class UserGameSetting extends Model {}

UserGameSetting.init({
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    notify: DataTypes.BOOLEAN,
}, {
    sequelize,
    modelName: 'UserGameSetting',
});

export default UserGameSetting;
