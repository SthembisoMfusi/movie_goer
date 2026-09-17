import 'dotenv/config';
import Fastify from 'fastify';
import fastifyJwt from '@fastify/jwt';

import sequelizePlugin from './plugins/sequelize.js';
import swaggerPlugin from './plugins/swagger.js'

import titleRoutes from './routes/title.routes.js';
import authRoutes from './routes/auth.routes.js';
import personRoutes from './routes/person.routes.js';
import watchlistRoutes from './routes/watchlist.routes.js';




const fastify = Fastify({
    logger: true
});

fastify.register(sequelizePlugin);
fastify.register(swaggerPlugin);
fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET as string
});



fastify.register(titleRoutes, { prefix: '/titles' });
fastify.register(authRoutes, { prefix: '/auth' })
fastify.register(personRoutes, { prefix:'/people'})
fastify.register(watchlistRoutes, { prefix: '/watchlist' });


export { fastify as app};
const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
        console.log('Server listening at http://localhost:3000');
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
if (process.env.NODE_ENV !== 'test') {
    start();
}