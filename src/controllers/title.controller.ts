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

