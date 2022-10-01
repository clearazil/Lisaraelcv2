import type {QueryInterface} from 'sequelize';
import Sequelize from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('Games', 'lastUsed', {
        type: Sequelize.DATE,
    });

    await queryInterface.changeColumn('Games', 'discordRoleId', {
        type: Sequelize.STRING,
        allowNull: true,
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('Games', 'lastUsed');
    await queryInterface.changeColumn('Games', 'discordRoleId', {
        type: Sequelize.STRING,
        allowNull: false,
    });
}
