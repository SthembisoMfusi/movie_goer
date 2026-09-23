import { Sequelize } from 'sequelize';
import { User } from '../models/User.model.js';
import { Watchlist } from '../models/Watchlist.model.js';

declare module 'fastify' {
    interface FastifyInstance {
        db: {
            sequelize: Sequelize;
            User: typeof User;
            Watchlist: typeof Watchlist;
        };
    }
    interface FastifyContextConfig {
        rateLimit?: {
            max?: number;
            timeWindow?: string;
        };
    }
}