import type {QueryInterface} from 'sequelize';
import Sequelize from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('PlayTimes', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        guildId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {model: 'Guilds', key: 'id'},
        },
        name: {
            type: Sequelize.STRING,
        },
        emoji: {
            type: Sequelize.STRING,
        },
        timeStart: {
            type: Sequelize.TIME,
        },
        timeEnd: {
            type: Sequelize.TIME,
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
    await queryInterface.dropTable('PlayTimes');
}
