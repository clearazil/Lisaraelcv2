import type {QueryInterface} from 'sequelize';
import Sequelize from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('Guilds', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.STRING,
        },
        discordGuildId: {
            allowNull: false,
            type: Sequelize.STRING,
            unique: true,
        },
        name: {
            allowNull: false,
            type: Sequelize.STRING,
        },
        moderatorRoleId: {
            type: Sequelize.STRING,
        },
        settingsChannelId: {
            type: Sequelize.STRING,
        },
        gamesChannelId: {
            type: Sequelize.STRING,
        },
        playingChannelId: {
            type: Sequelize.STRING,
        },
        botChannelId: {
            type: Sequelize.STRING,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
        },
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('Guilds');
}
