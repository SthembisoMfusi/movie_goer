import type { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';

export const searchPeople = async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.query as any).q;
    if (!query) {
        return reply.status(400).send({ error: 'Please provide a search term' })
    }
    try {
        const results = await request.server.db.Person.findAll({
            where: {
                primaryName: {
                    [Op.iLike]: `%${query}%`
                },

            },
            limit: 5,
        })
        return reply.send({ success: true, results});
    } catch (error){
        request.server.log.error(error)
        return reply.status(500).send({ error: 'Database search failed'})
    }
}

export const getPersonById = async (request: FastifyRequest, reply: FastifyReply) => {
    const id = (request.params as any).id;
    if (!id){
        return reply.status(400).send({ error: 'Please provide an ID'})
    }
    try {
        const person = await request.server.db.Person.findByPk(id)
        if (!person) {
            return reply.status(404).send({ error: 'Person not found'});
        }
        return reply.send({ success: true, person});
    } catch (error){
        request.server.log.error(error)
        return reply.status(500).send({ error: 'Database query failed'})
    }
}



