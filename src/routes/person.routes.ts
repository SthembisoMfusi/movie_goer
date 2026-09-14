import type { FastifyInstance } from 'fastify';
import { searchPeople, getPersonById, getPersonCredits } from '../controllers/person.controller.js';
import { searchRateLimit } from '../config/rateLimits.js';
import { searchPersonSchema, getPersonByIdSchema } from '../schemas/person.schema.js';

export default async function personRoutes(fastify: FastifyInstance) {
    fastify.get('/search', { schema: searchPersonSchema, config: searchRateLimit }, searchPeople);
    fastify.get('/:id', { schema: getPersonByIdSchema }, getPersonById);
    fastify.get('/:id/credits', { schema: getPersonByIdSchema }, getPersonCredits);
}