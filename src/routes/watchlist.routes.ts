import type { FastifyInstance } from 'fastify';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller.js';
import { mutationRateLimit, searchRateLimit } from '../config/rateLimits.js';

export default async function watchlistRoutes(fastify: FastifyInstance) {
    fastify.get('/', { config: searchRateLimit },getWatchlist);
    fastify.post('/:titleId', { config: mutationRateLimit }, addToWatchlist);
    fastify.delete('/:titleId', { config: mutationRateLimit }, removeFromWatchlist);
}