import type { FastifyRequest, FastifyReply } from 'fastify';
import { Op } from 'sequelize';

/**
 * Searches for actors/directors by name using a case-insensitive query.
 * @route GET /people/search?q={query}
 */
export const searchPeople = async (request: FastifyRequest, reply: FastifyReply) => {
    const query = (request.query as any).q;
    const page = Math.max(1, parseInt((request.query as any).page) || 1); 
    const limit = Math.min(50, Math.max(1, parseInt((request.query as any).limit) || 10)); 
    const offset = (page - 1) * limit;
    
    if (!query) {
        return reply.status(400).send({ error: 'Please provide a search term' })
    }
    
    try {
        const { count, rows } = await request.server.db.Person.findAndCountAll({
            where: {
                primaryName: {
                    [Op.iLike]: `%${query}%`
                },
            },
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
            results: rows 
        });
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