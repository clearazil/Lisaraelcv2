import type {QueryInterface} from 'sequelize';
import Sequelize from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('Games', 'discordMessageId');
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.addColumn('Games', 'discordMessageId', {
        type: Sequelize.STRING,
        allowNull: true,
    });
}
