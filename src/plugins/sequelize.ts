import { Sequelize } from 'sequelize';
import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify';

import { User, initUserModel } from '../models/User.model.js';
import { Title, initTitleModel } from '../models/Title.model.js';
import { Person, initPersonModel } from '../models/Person.model.js';
import { Rating, initRatingModel } from '../models/Rating.model.js';
import { CastCrew, initCastCrewModel } from '../models/CastCrew.model.js';
import {  Watchlist, initWatchlistModel } from '../models/Watchlist.model.js';

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
    initTitleModel(sequelize);
    initPersonModel(sequelize);
    initRatingModel(sequelize);
    initCastCrewModel(sequelize);
    initWatchlistModel(sequelize);

    Title.hasOne(Rating, { foreignKey: 'tconst' });
    Rating.belongsTo(Title, { foreignKey: 'tconst' });

    Title.belongsToMany(Person, { through: CastCrew, foreignKey: 'tconst', otherKey: 'nconst', constraints: false });
    Person.belongsToMany(Title, { through: CastCrew, foreignKey: 'nconst', otherKey: 'tconst', constraints: false });

    User.belongsToMany(Title, { through: Watchlist, foreignKey: 'userId', otherKey: 'titleId', as: 'SavedTitles' });
    Title.belongsToMany(User, { through: Watchlist, foreignKey: 'titleId', otherKey: 'userId' });

    Title.hasMany(CastCrew, { foreignKey: 'tconst' });
    CastCrew.belongsTo(Title, { foreignKey: 'tconst' });
    Person.hasMany(CastCrew, { foreignKey: 'nconst' });
    CastCrew.belongsTo(Person, { foreignKey: 'nconst' });





    fastify.decorate('db', {
        sequelize,
        User,
        Title,
        Person,
        Rating,
        CastCrew,
        Watchlist
    });


    fastify.addHook("onClose", async () => {
        await sequelize.close();
    });
}

export default fp(sequelizePlugin);