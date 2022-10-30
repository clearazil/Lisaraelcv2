import type {Includeable} from 'sequelize';
import {Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import User from './User';
import Game from './Game';
import type GamesPageData from '@components/types/GamesPageData';

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

    public async getGuildUser(discordUserId: string, name: string, include: Includeable | undefined = undefined): Promise<User> {
        const [user] = await User.findOrCreate({
            where: {
                discordUserId,
                guildId: this.id,
            },
            include,
            defaults: {
                name,
            },
        });

        return user;
    }

    public async paginatedGuildGames(currentPage: number, include: Includeable | undefined = undefined): Promise<GamesPageData> {
        const limit = 10;
        const offset = (currentPage - 1) * limit;

        const games = await Game.findAll({
            where: {
                guildId: this.id,
            },
            include,
            limit,
            offset,
        });

        const totalGames = await this.guildGamesCount();
        const finalPage = Math.ceil(totalGames / limit);

        return {games, currentPage, finalPage};
    }

    public async guildGamesCount(): Promise<number> {
        const count = await Game.count({
            where: {
                guildId: this.id,
            },
        });

        return count;
    }
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
