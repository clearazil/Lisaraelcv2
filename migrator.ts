import 'module-alias/register';
import {Sequelize} from 'sequelize';
import type {QueryInterface} from 'sequelize';
import {Umzug, SequelizeStorage} from 'umzug';
import database from '@config/database';

const sequelize: Sequelize = new Sequelize({dialect: database.dialect, storage: database.storage});

type Migration = {
    up: (queryInterface: QueryInterface) => Promise<void>;
    down: (queryInterface: QueryInterface) => Promise<void>;
};

const umzug = new Umzug({
    migrations: {
        glob: 'migrations/*.ts',
        resolve({name, path, context}) {
            return {
                name,
                async up() {
                    const migration: Migration = await import(String(path)) as Migration;
                    await migration.up(context);
                },
                async down() {
                    const migration: Migration = await import(String(path)) as Migration;
                    await migration.down(context);
                },
            };
        },
    },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({sequelize}),
    logger: console,
});

const _umzug = umzug;
export {_umzug as umzug};

async function main(): Promise<void> {
    await umzug.runAsCLI();
}

void main();
