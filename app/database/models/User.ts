import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import type UserSetting from './UserSetting';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class User extends Model {
    declare id: number;
    declare guildId: number;
    declare name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    declare UserSetting: UserSetting;
}

User.init({
    guildId: DataTypes.INTEGER,
    discordUserId: DataTypes.STRING,
    name: DataTypes.STRING,
}, {
    sequelize,
    modelName: 'User',
});

export default User;
