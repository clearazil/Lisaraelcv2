import type {QueryInterface} from 'sequelize';
import Sequelize from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('PlayTimeUsers', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        PlayTimeId: {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {model: 'PlayTimes', key: 'id'},
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        UserId: {
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {model: 'Users', key: 'id'},
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
    await queryInterface.dropTable('PlayTimeUsers');
}
