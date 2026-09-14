import type { FastifyInstance } from 'fastify';
import { searchTitles, getTitleById, getTopRatedTitles } from '../controllers/title.controller.js';
import { searchTitleSchema, getTitleByIdSchema, getTopRatedSchema } from '../schemas/title.schema.js';

export default async function titleRoutes(fastify: FastifyInstance) {
    fastify.get('/search', { schema: searchTitleSchema }, searchTitles);
    fastify.get('/top-rated', { schema: getTopRatedSchema }, getTopRatedTitles);
    fastify.get('/:id', { schema: getTitleByIdSchema }, getTitleById);
}