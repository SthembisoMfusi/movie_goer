import type { FastifyRequest, FastifyReply } from 'fastify';
import { tmdb } from '../services/tmdb.service.js';
import TmdbError from '../errors/Tmdb.error.js';


/** @route GET /people/search?q={query}&page={page} */
export const searchPeople = async (request: FastifyRequest, reply: FastifyReply) => {
    const { q: query, page } = request.query as { q: string; page: number };

    try {
        const data = await tmdb.searchPeople(query, page);
        return reply.send(data);
    } catch (error) {
        request.server.log.error(error);
        return reply.status(502).send({ error: 'TMDB search failed' });
    }
};

/** @route GET /people/:id */
export const getPersonById = async (request: FastifyRequest, reply: FastifyReply) => {
    const rawId = (request.params as { id: string }).id;
    const id = rawId.trim();

    try {
        const data = await tmdb.getPersonById(id);
        return reply.send(data);
    } catch (error) {
        if (error instanceof TmdbError && error.status === 404) {
            return reply.status(404).send({ error: 'Person not found' });
        }
        request.server.log.error(error);
        return reply.status(502).send({ error: 'TMDB request failed' });
    }
};

/** @route GET /people/:id/credits */
export const getPersonCredits = async (request: FastifyRequest, reply: FastifyReply) => {
    const rawId = (request.params as { id: string }).id;
    const id = rawId.trim();

    try {
        const person = await tmdb.getPersonById(id);
        const credits = await tmdb.getPersonMovieCredits(id);
        return reply.send({ person, credits });
    } catch (error) {
        if (error instanceof TmdbError && error.status === 404) {
            return reply.status(404).send({ error: 'Person not found' });
        }
        request.server.log.error(error);
        return reply.status(502).send({ error: 'TMDB request failed' });
    }
};