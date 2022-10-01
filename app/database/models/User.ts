import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import PlayTime from './PlayTime';
import UserGameSetting from './UserGameSetting';
import UserSetting from './UserSetting';
import Guild from './Guild';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class User extends Model {}

User.init({
    guildId: DataTypes.INTEGER,
    discordUserId: DataTypes.STRING,
    name: DataTypes.STRING,
}, {
    sequelize,
    modelName: 'User',
});

User.belongsToMany(PlayTime, {through: 'PlayTimeUsers'});
User.hasMany(UserGameSetting);
User.hasOne(UserSetting);
User.belongsTo(Guild);

export default User;
