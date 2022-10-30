import type {QueryInterface} from 'sequelize';
import Sequelize from 'sequelize';

// Using raw query because sequelize drops table using queryInterface.dropColumn method
export async function up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query('ALTER TABLE Games DROP COLUMN discordMessageId');
}

export async function down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.query('ALTER TABLE Games ADD COLUMN discordMessageId VARCHAR(255)');
}
