import type { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';

/**
 * Searches for actors/directors by name using a case-insensitive query.
 * @route GET /people/search?q={query}
 */
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
        return reply.send({ success: true, results });
    } catch (error){
        request.server.log.error(error)
        return reply.status(500).send({ error: 'Database search failed' })
    }
}

/**
 * Fetches a single person by their ID.
 * @route GET /people/:id
 */
export const getPersonById = async (request: FastifyRequest, reply: FastifyReply) => {
    const rawId = (request.params as any).id;
    
    if (!rawId){
        return reply.status(400).send({ error: 'Please provide an ID' })
    }
    
    const id = rawId.trim();
    
    try {
        const person = await request.server.db.Person.findByPk(id)
        if (!person) {
            return reply.status(404).send({ error: 'Person not found' });
        }
        return reply.send({ success: true, person });
    } catch (error){
        request.server.log.error(error)
        return reply.status(500).send({ error: 'Database query failed' })
    }
}

/**
 * Fetches the movie credits associated with a specific person.
 * @route GET /people/:id/credits
 */
export const getPersonCredits = async (request: FastifyRequest, reply: FastifyReply) =>{
    const rawId = (request.params as any).id;
    
    if (!rawId){
        return reply.status(400).send({ error: 'Please provide a person ID' })
    }
    
    const id = rawId.trim();
    
    try {
        const person = await request.server.db.Person.findByPk(id, {
            include: [{
                model: request.server.db.Title,
                through: {
                    attributes: ['category', 'job', 'characters']
                }
            }]
        });
        
        if (!person){
            return reply.status(404).send({ error: 'Person not found' })
        }
        
        return reply.send({ success: true, person })
    } catch (error){
        request.server.log.error(error);
        return reply.status(500).send({ error: 'Database query failed' })
    }
}