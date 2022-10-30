/*
 * Seperate associations file fixes (Model).belongsTo called with something that's not a subclass of Sequelize.Model:
 * https://stackoverflow.com/questions/53882278/sequelize-association-called-with-something-thats-not-a-subclass-of-sequelize-m
*/

import Guild from './models/Guild';
import GameAlias from './models/GameAlias';
import Game from './models/Game';
import UserGameSetting from './models/UserGameSetting';
import User from './models/User';
import BotMessages from './models/BotMessages';
import PlayTime from './models/PlayTime';
import UserSetting from './models/UserSetting';

function associate() {
    GameAlias.belongsTo(Game, {foreignKey: 'gameId', onDelete: 'cascade', hooks: true});
    Game.hasMany(GameAlias, {onDelete: 'CASCADE'});

    Game.hasMany(UserGameSetting, {onDelete: 'CASCADE'});
    UserGameSetting.belongsTo(Game);

    User.belongsTo(Guild);
    Guild.hasMany(User);

    BotMessages.belongsTo(Guild);
    Guild.hasMany(BotMessages);

    Game.belongsTo(Guild);
    Guild.hasMany(Game);

    PlayTime.belongsTo(Guild);
    Guild.hasMany(PlayTime);

    PlayTime.belongsToMany(User, {through: 'PlayTimeUsers'});
    User.belongsToMany(PlayTime, {through: 'PlayTimeUsers'});

    UserGameSetting.belongsTo(User);
    User.hasMany(UserGameSetting);

    UserSetting.belongsTo(User);
    User.hasOne(UserSetting);
}

export default associate;

