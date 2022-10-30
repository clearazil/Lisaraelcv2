import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import type UserSetting from './UserSetting';
import type PlayTime from './PlayTime';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class User extends Model {
    declare id: number;
    declare guildId: number;
    declare name: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    declare UserSetting: UserSetting;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    declare PlayTimes: PlayTime[];
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
