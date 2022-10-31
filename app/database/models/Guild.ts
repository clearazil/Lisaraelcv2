import type {Includeable} from 'sequelize';
import {Op, Sequelize, Model, DataTypes} from 'sequelize';
import database from '@config/database';
import User from './User';
import Game from './Game';
import type GamesPageData from '@components/types/GamesPageData';
import PlayTime from './PlayTime';

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

            await guild.seedPlayTimes();
        }

        return guild;
    }

    declare id: number;
    declare discordGuildId: string;
    declare name: string;
    declare moderatorRoleId: string;
    declare settingsChannel: string;
    declare gamesChannelId: string;
    declare playingChannelId: string;
    declare botChannelId: string;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    declare PlayTimes: PlayTime[];

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

    private async seedPlayTimes() {
        const playTimes = [];

        playTimes.push(
            {
                guildId: this.id,
                name: 'morning',
                emoji: '1️⃣',
                timeStart: '08:00:00',
                timeEnd: '11:59:59',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                guildId: this.id,
                name: 'afternoon',
                emoji: '2️⃣',
                timeStart: '12:00:00',
                timeEnd: '17:59:59',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                guildId: this.id,
                name: 'evening',
                emoji: '3️⃣',
                timeStart: '18:00:00',
                timeEnd: '23:59:59',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                guildId: this.id,
                name: 'night',
                emoji: '4️⃣',
                timeStart: '00:00:00',
                timeEnd: '07:59:59',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        );

        await PlayTime.bulkCreate(playTimes);
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
