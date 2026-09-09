import type { FastifyInstance } from 'fastify';
import { searchTitles } from '../controllers/title.controller.js';

export default async function titleRoutes(fastify: FastifyInstance){
    fastify.get('/search', searchTitles);
}
