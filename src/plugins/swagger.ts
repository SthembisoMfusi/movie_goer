import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';

const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'movieGoer API',
    description: 'An IMDb clone REST API built with Fastify, Sequelize, and PostgreSQL.',
    version: '1.0'
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local development server' }],
  tags: [
    { name: 'Auth', description: 'User registration, login, and profile operations' },
    { name: 'Titles', description: 'Movies, TV shows, and ratings' },
    { name: 'People', description: 'Actors, directors, and writers' },
    { name: 'Watchlist', description: 'Authenticated user watchlists' }
  ],
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } }
        },
        responses: {
          '201': { description: 'User created successfully' },
          '400': { description: 'Missing required fields' },
          '409': { description: 'Email already in use' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive a JWT',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } }
        },
        responses: {
          '200': { description: 'Login successful' },
          '401': { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current logged-in user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User profile data' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/titles/search': {
      get: {
        tags: ['Titles'],
        summary: 'Search for movies by title',
        parameters: [{ in: 'query', name: 'q', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'A list of matching movies' }
        }
      }
    },
    '/titles/{id}': {
      get: {
        tags: ['Titles'],
        summary: 'Get a movie by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'The requested movie' },
          '404': { description: 'Movie not found' }
        }
      }
    },
    '/titles/top-rated': {
      get: {
        tags: ['Titles'],
        summary: 'Get the top-rated movies',
        responses: {
          '200': { description: 'A list of top-rated movies' }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    schemas: {
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } }
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } }
      }
    }
  }
};

async function swaggerConfig(fastify: FastifyInstance) {

  await fastify.register(fastifySwagger, {
    mode: 'static',
    specification: {
      document: openApiDocument as any
    }
  });


  await fastify.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });
}

export default fp(swaggerConfig);