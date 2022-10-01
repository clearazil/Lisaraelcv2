import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class PlayTimeUser extends Model {}

PlayTimeUser.init({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PlayTimeId: DataTypes.INTEGER,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    UserId: DataTypes.INTEGER,
}, {
    sequelize,
    modelName: 'PlayTimeUser',
});

export default PlayTimeUser;
