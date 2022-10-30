import type {Includeable} from 'sequelize';
import {Op, Sequelize, Model, DataTypes} from 'sequelize';
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

    public async getGuildUser(discordUserId: string, name: string, include: Includeable | Includeable[] | undefined = undefined): Promise<User> {
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

    public async paginatedGuildGames(currentPage: number, include: Includeable | undefined = undefined, search: string | undefined = undefined): Promise<GamesPageData> {
        const limit = 10;
        const offset = (currentPage - 1) * limit;

        const where = this.whereWithSearch(search);

        const games = await Game.findAll({
            order: [
                ['name', 'ASC'],
            ],
            where,
            include,
            limit,
            offset,
        });

        const totalGames = await this.guildGamesCount(search);
        const finalPage = Math.ceil(totalGames / limit);

        return {games, currentPage, finalPage};
    }

    public async guildGamesCount(search: string | undefined): Promise<number> {
        const where = this.whereWithSearch(search);

        const count = await Game.count({
            where,
        });

        return count;
    }

    private whereWithSearch(search: string | undefined) {
        let where = {
            guildId: this.id,
        };

        if (search !== undefined) {
            where = {...where, ...{name: {
                [Op.like]: `%${search}%`,
            }}};
        }

        return where;
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
