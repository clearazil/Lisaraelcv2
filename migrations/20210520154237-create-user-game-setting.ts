import type {QueryInterface} from 'sequelize';
import Sequelize from 'sequelize';

export async function up(queryInterface: QueryInterface) {
    await queryInterface.createTable('UserGameSettings', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        userId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {model: 'Users', key: 'id'},
        },
        gameId: {
            allowNull: false,
            type: Sequelize.INTEGER,
            onDelete: 'CASCADE',
            references: {model: 'Games', key: 'id'},
        },
        notify: {
            allowNull: false,
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
    }, {
        uniqueKeys: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            actions_unique: {
                fields: ['userId', 'gameId'],
            },
        },
    });
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('UserGameSettings');
}
