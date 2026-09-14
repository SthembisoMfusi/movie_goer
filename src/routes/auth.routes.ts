import type { FastifyInstance } from 'fastify';
import { registerUser, loginUser, fetchUser, deleteUser } from '../controllers/auth.controller.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/register',{ schema: registerSchema}, registerUser);
    fastify.post('/login', {schema: loginSchema},loginUser);
    fastify.get('/me', fetchUser);
    fastify.delete('/me',deleteUser );

};

