import type { FastifyInstance } from 'fastify';
import { registerUser, loginUser, fetchUser, deleteUser } from '../controllers/auth.controller.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';
import { authRateLimit, mutationRateLimit } from '../config/rateLimits.js';

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post('/register', { schema: registerSchema, config: authRateLimit }, registerUser);
    fastify.post('/login', { schema: loginSchema, config: authRateLimit }, loginUser);
    
    fastify.get('/me', fetchUser);
    fastify.delete('/me', { config: mutationRateLimit }, deleteUser);
}