import type { FastifyInstance } from 'fastify';
import { searchPeople, getPersonById, getPersonCredits } from '../controllers/person.controller.js';

export default async function personRoutes(fastify: FastifyInstance){
    fastify.get('/search', searchPeople);
    fastify.get('/:id', getPersonById);
    fastify.get('/:id/credits', getPersonCredits);
}
