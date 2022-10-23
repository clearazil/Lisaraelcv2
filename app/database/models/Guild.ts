import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

class Guild extends Model {
    public static async createIfNotExists(discordId: string, name: string) {
        let guild = await Guild.findOne({
            where: {
                discordGuildId: discordId,
            },
        });

        if (guild === null) {
            guild = await Guild.create({
                discordGuildId: discordId,
                name,
            });
        }

        return guild;
    }

    declare id: number;
}

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

export default Guild;
