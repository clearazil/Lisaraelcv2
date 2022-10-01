import type {QueryInterface} from 'sequelize';
import Sequelize from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('UserSettings', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        userId: {
            allowNull: false,
            type: Sequelize.STRING,
            onDelete: 'CASCADE',
            references: {model: 'Users', key: 'id'},
        },
        timeZone: {
            type: Sequelize.STRING,
        },
        timeZoneDifference: {
            type: Sequelize.STRING,
        },
        timeZoneOffset: {
            type: Sequelize.INTEGER,
        },
        notifyAllGames: {
            type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('UserSettings');
}
