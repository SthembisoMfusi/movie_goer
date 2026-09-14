import type { FastifyInstance } from 'fastify';
import { searchTitles, getTitleById, getTopRatedTitles } from '../controllers/title.controller.js';
import { searchTitleSchema, getTitleByIdSchema, getTopRatedSchema } from '../schemas/title.schema.js';
import { searchRateLimit } from '../config/rateLimits.js';

export default async function titleRoutes(fastify: FastifyInstance) {
    fastify.get('/search', { schema: searchTitleSchema, config: searchRateLimit }, searchTitles);
    fastify.get('/top-rated', { schema: getTopRatedSchema, config: searchRateLimit }, getTopRatedTitles);
    
    fastify.get('/:id', { schema: getTitleByIdSchema }, getTitleById);
}