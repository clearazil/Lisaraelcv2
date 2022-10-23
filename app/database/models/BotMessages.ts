import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class BotMessages extends Model {}

BotMessages.init({
    guildId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER,
    name: DataTypes.STRING,
}, {
    sequelize,
    modelName: 'BotMessages',
});

export default BotMessages;
