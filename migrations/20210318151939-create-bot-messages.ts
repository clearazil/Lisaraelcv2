import type {QueryInterface} from 'sequelize';
import Sequelize from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('BotMessages', {
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
        messageId: {
            type: Sequelize.STRING,
        },
        name: {
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
    await queryInterface.dropTable('BotMessages');
}
