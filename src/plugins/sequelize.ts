import { Sequelize } from 'sequelize';
import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';

import { User, initUserModel } from '../models/User.model.js';
import { Watchlist, initWatchlistModel } from '../models/Watchlist.model.js';

async function sequelizePlugin(fastify: FastifyInstance) {

    const sequelize = new Sequelize(
        process.env.DB_NAME || 'movie_goer',
        process.env.DB_USER || 'user',
        process.env.DB_PASSWORD || 'password',
        {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            dialect: 'postgres',
            logging: false,
        }
    );

    await sequelize.authenticate();
    fastify.log.info("Database connection established.");

    initUserModel(sequelize);
    initWatchlistModel(sequelize);

    User.hasMany(Watchlist, { foreignKey: 'userId' });
    Watchlist.belongsTo(User, { foreignKey: 'userId' });

    fastify.decorate('db', {
        sequelize,
        User,
        Watchlist
    });

    fastify.addHook("onClose", async () => {
        await sequelize.close();
    });
}

export default fp(sequelizePlugin);