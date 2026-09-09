import type { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';

export const searchTitles = async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.query as any).q;
    if (!query){
        return reply.status(400).send({ error: 'Please provide a search term'});
    }

    try {
        const results = await request.server.db.Title.findAll({
        where: {
            primaryTitle: {
                [Op.iLike]: `%${query}%`
            },
            titleType: 'movie'
        },
        limit: 10,
        include: [{ model: request.server.db.Rating, required: false}, ]
    })
    return reply.send({ success: true, results })
    } catch (error){
        request.server.log.error(error)
        return reply.status(500).send({ error: 'Database search failed'})
    }
};


export const getTitleById = async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.params as any).id;
    if (!id){
        return reply.status(400).send({ error: 'Please provide a title ID'});
    }

    try {
        const title = await request.server.db.Title.findByPk(id, {
            include: [{ model: request.server.db.Rating, required: false}]
        });
        if (!title) {
            return reply.status(404).send({ error: 'Title not found'});
        }
        return reply.send({ success: true, title });
    } catch (error){
        request.server.log.error(error)
        return reply.status(500).send({ error: 'Database query failed'});
    }
}

export const getTopRatedTitles = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const topRatedTitles = await request.server.db.Title.findAll({
            include: [{
                model: request.server.db.Rating,
                required: true,
                where: {
                    averageRating: {
                        [Op.gte]: 8.0
                    }
                }
            }]  ,
            order: [[request.server.db.Rating, 'averageRating', 'DESC']],
            limit: 10
        });
        return reply.send({ success: true, topRatedTitles });
    } catch (error) {
        request.server.log.error(error);
        return reply.status(500).send({ error: 'Database query failed' });
    }
};