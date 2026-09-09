import type { FastifyInstance } from 'fastify';
import { registerUser, loginUser, fetchUser, deleteUser } from '../controllers/auth.controller.js'

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/register', registerUser);
    fastify.post('/login', loginUser);
    fastify.get('/me', fetchUser);
    fastify.delete('/me',deleteUser );

};

