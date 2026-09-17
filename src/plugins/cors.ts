import fp from 'fastify-plugin';
import fastifyCors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';

async function corsPlugin(fastify: FastifyInstance) {
    const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
        .split(',')
        .map((origin) => origin.trim());

    await fastify.register(fastifyCors, {
        origin: allowedOrigins,
        credentials: true,
    });
}

export default fp(corsPlugin);