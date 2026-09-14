import type { FastifyContextConfig } from 'fastify';
import '@fastify/rate-limit';

export const authRateLimit: FastifyContextConfig = {
    rateLimit: {
        max: 5, 
        timeWindow: '1 minute'
    }
};

export const searchRateLimit: FastifyContextConfig = {
    rateLimit: {
        max: 30, 
        timeWindow: '1 minute'
    }
};

export const mutationRateLimit: FastifyContextConfig = {
    rateLimit: {
        max: 60, 
        timeWindow: '1 minute'
    }
};