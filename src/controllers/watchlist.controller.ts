import type { FastifyRequest, FastifyReply} from 'fastify';
import { tmdb } from '../services/tmdb.service.js';
import { tmdb } from '../services/tmdb.service';
import Watchlist from '../models/Watchlist.model';

/**
 * Gets all titles in the authenticated user's watchlist.
 * @route GET /watchlist
 * @security Requires Bearer Token
 */
export const getWatchlist = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
        const { userId } = request.user as { userId: number };
        const items = await request.server.db.Watchlist.findAll({ where: { userId } });
        const watchlist = await Promise.all(
            items.map(item => tmdb.getMovieById(item.titleId).catch(() => ({ id: item.titleId, error: 'unavailable' })))
        );
        return reply.send({ success: true, watchlist });

    } catch (error: any) {
        if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' || error.message.includes('token')) {
            return reply.status(401).send({ error: 'Unauthorized: Invalid or missing token' });
        }
        
        request.server.log.error(error);
        return reply.status(500).send({ error: 'Database query failed' });
    }
};

export const addToWatchlist = async (request: FastifyRequest, reply: FastifyReply) => {
    const rawTitleId = (request.params as any).titleId;

    if (!rawTitleId){
        return reply.status(400).send({ error: 'Please provide a title ID'});
    }
    const titleId = rawTitleId.trim();
    try {
        await request.jwtVerify();
        const { userId } = request.user as { userId: number}
        const titleExists = await tmdb.getMovieById(titleId)
        if (!titleExists){
            return reply.status(404).send({ error: 'Movie not found in database'})
        }
        const [watchlistItem, created ] = await request.server.db.Watchlist.findOrCreate({
            where: { userId, titleId}
        });
        if (!created){
            return reply.status(409).send({ error: 'Movie is already in your watchlist'})
        }
        return reply.status(201).send({ success: true, message: 'Added to watchlist'});
    } catch (error: any){
        if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' || error.message.includes('token')) {
            return reply.status(401).send({ error: 'Unauthorized: Invalid or missing token' });
        }
        
        request.server.log.error(error);
        return reply.status(500).send({ error: 'Database query failed' });
    
    }
}
/**
 * Removes a movie from the user's watchlist.
 * @route DELETE /watchlist/:titleId
 * @security Requires Bearer Token
 */
export const removeFromWatchlist = async (request: FastifyRequest, reply: FastifyReply) => {
    const rawTitleId = (request.params as any).titleId;
    
    if (!rawTitleId) {
        return reply.status(400).send({ error: 'Please provide a title ID' });
    }

    const titleId = rawTitleId.trim();

    try {
        await request.jwtVerify();
        const { userId } = request.user as { userId: number };

        const deletedCount = await request.server.db.Watchlist.destroy({
            where: { userId, titleId }
        });

        if (deletedCount === 0) {
            return reply.status(404).send({ error: 'Movie not found in your watchlist' });
        }

        return reply.send({ success: true, message: 'Removed from watchlist' });
    } catch (error: any) {
        if (error.code === 'FST_JWT_NO_AUTHORIZATION_IN_HEADER' || error.message.includes('token')) {
            return reply.status(401).send({ error: 'Unauthorized: Invalid or missing token' });
        }
        
        request.server.log.error(error);
        return reply.status(500).send({ error: 'Database query failed' });
    
    }
};