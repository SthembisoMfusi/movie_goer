import { Sequelize } from 'sequelize';
import { User } from '../models/User.model.js';
import { Title } from '../models/Title.model.js';
import { Person } from '../models/Person.model.js';
import { Rating } from '../models/Rating.model.js';
import { CastCrew } from '../models/CastCrew.model.js';
import { Watchlist } from '../models/Watchlist.model';

declare module 'fastify' {
    interface FastifyInstance {
        db: {
            sequelize: Sequelize;
            User: typeof User;
            Title: typeof Title;
            Person: typeof Person;
            Rating: typeof Rating;
            CastCrew: typeof CastCrew;
            Watchlist: typeof Watchlist;
        };
    }
}