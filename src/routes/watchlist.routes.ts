import type { FastifyInstance } from 'fastify';
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../controllers/watchlist.controller.js';

export default async function watchlistRoutes(fastify: FastifyInstance) {
    fastify.get('/', getWatchlist);
    fastify.post('/:titleId', addToWatchlist);
    fastify.delete('/:titleId', removeFromWatchlist);
}