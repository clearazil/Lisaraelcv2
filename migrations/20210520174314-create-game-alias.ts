import type {QueryInterface} from 'sequelize';
import Sequelize from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('GameAliases', {
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
        gameId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {model: 'Games', key: 'id'},
        },
        name: {
            allowNull: false,
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
    await queryInterface.dropTable('GameAliases');
}
