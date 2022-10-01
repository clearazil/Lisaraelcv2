import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import User from './User';
import BotMessages from './BotMessages';
import Game from './Game';
import PlayTime from './PlayTime';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class Guild extends Model {}

Guild.init({
    discordGuildId: DataTypes.STRING,
    name: DataTypes.STRING,
    moderatorRoleId: DataTypes.STRING,
    settingsChannelId: DataTypes.STRING,
    gamesChannelId: DataTypes.STRING,
    playingChannelId: DataTypes.STRING,
    botChannelId: DataTypes.STRING,
}, {
    sequelize,
    modelName: 'Guild',
});

Guild.hasMany(User);
Guild.hasMany(BotMessages);
Guild.hasMany(Game);
Guild.hasMany(PlayTime);

export default Guild;
