import type { FastifyRequest, FastifyReply } from 'fastify';
import { tmdb } from '../services/tmdb.service.js';
import TmdbError  from "../errors/Tmdb.error.js";

/**
 * Searches TMDB for movies by title.
 * @route GET /titles/search?q={query}&page={page}
 */
export const searchTitles = async (request: FastifyRequest, reply: FastifyReply) => {
    const { q: query, page } = request.query as { q: string; page: number };

    try {
        const data = await tmdb.searchMovies(query, page);
        return reply.send(data);
    } catch (error) {
        request.server.log.error(error);
        return reply.status(502).send({ error: 'TMDB search failed' });
    }
};

/**
 * Fetches a single movie by TMDB ID, including credits.
 * @route GET /titles/:id
 */
export const getTitleById = async (request: FastifyRequest, reply: FastifyReply) => {
    const rawId = (request.params as { id: string }).id;
    const id = rawId.trim();

    try {
        const data = await tmdb.getMovieById(id);
        return reply.send(data);
    } catch (error) {
        if (error instanceof TmdbError && error.status === 404) {
            return reply.status(404).send({ error: 'Title not found' });
        }
        request.server.log.error(error);
        return reply.status(502).send({ error: 'TMDB request failed' });
    }
};

/**
 * Fetches TMDB's top-rated movies.
 * @route GET /titles/top-rated?page={page}
 */
export const getTopRatedTitles = async (request: FastifyRequest, reply: FastifyReply) => {
    const { page } = request.query as { page: number };

    try {
        const data = await tmdb.getTopRatedMovies(page);
        return reply.send(data);
    } catch (error) {
        request.server.log.error(error);
        return reply.status(502).send({ error: 'TMDB request failed' });
    }
};