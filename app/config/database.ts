import dotenv from 'dotenv';
import type {Dialect} from 'sequelize';

dotenv.config();

export default {
    dialect: 'sqlite' as Dialect,
    storage: './database.sqlite',
};
