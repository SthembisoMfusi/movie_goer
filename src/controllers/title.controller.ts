import type { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';

/**
 * Searches for movies by title using a case-insensitive wildcard query.
 * @route GET /titles/search?q={query}
 */
export const searchTitles = async (request: FastifyRequest, reply: FastifyReply) => {
    const { q: query, page, limit } = request.query as { q: string; page: number; limit: number };
    const offset = (page - 1) * limit;

    try {
        const { count, rows } = await request.server.db.Title.findAndCountAll({
            where: {
                primaryTitle: {
                    [Op.iLike]: `%${query}%`
                },
                titleType: 'movie'
            },
            limit: limit,
            offset: offset,
            include: [{ model: request.server.db.Rating, required: false }]
        });
        
        return reply.send({
            success: true,
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                itemsPerPage: limit
            },
            results: rows
        });
    } catch (error) {
        request.server.log.error(error);
        return reply.status(500).send({ error: 'Database search failed' })
    }
};

/**
 * Fetches a single title by its ID, including ratings and cast members.
 * @route GET /titles/:id
 */
export const getTitleById = async (request: FastifyRequest, reply: FastifyReply) => {
    const rawId = (request.params as { id: string }).id;
    const id = rawId.trim(); 

    try {
        const title = await request.server.db.Title.findByPk(id, {
            include: [
                { model: request.server.db.Rating, required: false },
                { model: request.server.db.Person, required: false }
            ]
        });

        if (!title) {
            return reply.status(404).send({ error: 'Title not found' });
        }

        return reply.send({ success: true, title });
    } catch (error) {
        request.server.log.error(error);
        return reply.status(500).send({ error: 'Database query failed' });
    }
}

/**
 * Fetches the top 10 highest-rated titles in the database.
 * @route GET /titles/top-rated
 */
export const getTopRatedTitles = async (request: FastifyRequest, reply: FastifyReply) => {
    const { page, limit } = request.query as { page: number; limit: number };
    const offset = (page - 1) * limit;
    
    try {
        const { count, rows } = await request.server.db.Title.findAndCountAll({
            include: [{
                model: request.server.db.Rating,
                required: true,
                where: {
                    averageRating: {
                        [Op.gte]: 8.0
                    }
                }
            }],
            order: [[request.server.db.Rating, 'averageRating', 'DESC']],
            limit: limit,
            offset: offset 
        });
        
        return reply.send({ 
            success: true, 
            pagination: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page,
                itemsPerPage: limit
            },
            topRatedTitles: rows 
        });
    } catch (error) {
        request.server.log.error(error);
        return reply.status(500).send({ error: 'Database query failed' });
    }
};