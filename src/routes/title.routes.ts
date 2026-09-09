import type { FastifyInstance } from 'fastify';
import { searchTitles,getTitleById, getTopRatedTitles } from '../controllers/title.controller.js';

export default async function titleRoutes(fastify: FastifyInstance){
    fastify.get('/search', searchTitles);
    fastify.get('/top-rated', getTopRatedTitles);
    fastify.get('/:id',getTitleById);
}
