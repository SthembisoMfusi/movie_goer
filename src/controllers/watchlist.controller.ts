import type { FastifyRequest, FastifyReply} from 'fastify';

/**
 * Gets all titles in the authenticated user's watchlist.
 * @route GET /watchlist
 * @security Requires Bearer Token
 */
export const getWatchlist = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        await request.jwtVerify();
        const { userId } = request.user as { userId: number };

        const userWithWatchlist = await request.server.db.User.findByPk(userId, {
            attributes: ['id', 'name'], 
            include: [{
                model: request.server.db.Title,
                as: 'SavedTitles',
                attributes: ['tconst', 'primaryTitle', 'titleType', 'startYear', 'runtimeMinutes', 'genres'],
                include: [{ model: request.server.db.Rating, required: false }]
            }]
        });

        if (!userWithWatchlist) {
            return reply.status(404).send({ error: 'User not found' });
        }

        const userJson = userWithWatchlist.toJSON() as any;
        return reply.send({ success: true, watchlist: userJson.SavedTitles || [] });

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
        const titleExists = await request.server.db.Title.findByPk(titleId);
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