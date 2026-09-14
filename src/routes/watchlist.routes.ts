import type { FastifyInstance } from 'fastify';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller.js';
import { mutationRateLimit } from '../config/rateLimits.js';

export default async function watchlistRoutes(fastify: FastifyInstance) {
    fastify.get('/', getWatchlist);
    fastify.post('/:titleId', { config: mutationRateLimit }, addToWatchlist);
    fastify.delete('/:titleId', { config: mutationRateLimit }, removeFromWatchlist);
}