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
        summary: 'Search for movies by title with pagination',
        parameters: [
          { in: 'query', name: 'q', required: true, schema: { type: 'string' }, description: 'The search term (e.g., "Batman")' },
          { in: 'query', name: 'page', required: false, schema: { type: 'integer', default: 1 }, description: 'Page number for pagination' },
          { in: 'query', name: 'limit', required: false, schema: { type: 'integer', default: 10 }, description: 'Items per page (Max: 50)' }
        ],
        responses: {
          '200': { 
            description: 'A paginated list of matching movies',
            content: { 
              'application/json': { 
                schema: { 
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    pagination: {
                      type: 'object',
                      properties: {
                        totalItems: { type: 'integer' },
                        totalPages: { type: 'integer' },
                        currentPage: { type: 'integer' },
                        itemsPerPage: { type: 'integer' }
                      }
                    },
                    results: { 
                      type: 'array', 
                      items: { $ref: '#/components/schemas/Title' } 
                    }
                  }
                } 
              } 
            }
          }
        }
      }
    },
    '/titles/{id}': {
      get: {
        tags: ['Titles'],
        summary: 'Get a movie by ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { 
            description: 'The requested movie',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Title' } } }
          },
          '404': { description: 'Movie not found' }
        }
      }
    },
  '/titles/top-rated': {
      get: {
        tags: ['Titles'],
        summary: 'Get the top-rated movies',
        parameters: [
          { in: 'query', name: 'page', required: false, schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', required: false, schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': { 
            description: 'A paginated list of top-rated movies',
            content: { 
              'application/json': { 
                schema: { 
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    pagination: {
                      type: 'object',
                      properties: { totalItems: { type: 'integer' }, totalPages: { type: 'integer' }, currentPage: { type: 'integer' }, itemsPerPage: { type: 'integer' } }
                    },
                    topRatedTitles: { type: 'array', items: { $ref: '#/components/schemas/Title' } } 
                  }
                } 
              } 
            }
          }
        }
      }
    },
    '/people/search':{
      get: {
        tags: ['People'],
        summary: 'Search for a person by their name',
        parameters: [
          { in: 'query', name:'q', required: true, schema: { type: 'string' } },
          { in: 'query', name: 'page', required: false, schema: { type: 'integer', default: 1 } },
          { in: 'query', name: 'limit', required: false, schema: { type: 'integer', default: 10 } }
        ],
        responses: {
          '200': { 
            description: 'A paginated list of matching people',
            content: { 
              'application/json': { 
                schema: { 
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    pagination: {
                      type: 'object',
                      properties: { totalItems: { type: 'integer' }, totalPages: { type: 'integer' }, currentPage: { type: 'integer' }, itemsPerPage: { type: 'integer' } }
                    },
                    results: { type: 'array', items: { $ref: '#/components/schemas/Person' } } 
                  }
                } 
              } 
            }
          }
        }
      }
    },
    '/people/{id}': {
      get: {
        tags: ['People'],
        summary: 'Search for a person using their ID',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string'}}],
        responses: {
          '200': { 
            description: 'The requested person',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Person' } } }
          },
          '404': { description: 'Person not found' }
        }
      }
    },
    '/people/{id}/credits': {
      get: {
        tags: ['People'],
        summary: 'Search for a person and their credits',
        parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string'}}],
        responses: {
          '200': { description: 'The requested person and their associated movies' },
          '404': { description: 'Person not found' }
        }
      }
    },
    '/watchlist': {
      get: {
        tags: ['Watchlist'],
        summary: 'Get logged-in user\'s watchlist',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { 
            description: 'A list of saved movies',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Title' } } } }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/watchlist/{titleId}': {
      post: {
        tags: ['Watchlist'],
        summary: 'Add a movie to the watchlist',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'titleId', required: true, schema: { type: 'string' } }],
        responses: {
          '201': { description: 'Movie added to watchlist' },
          '404': { description: 'Movie not found' },
          '409': { description: 'Movie already in watchlist' },
          '401': { description: 'Unauthorized' }
        }
      },
      delete: {
        tags: ['Watchlist'],
        summary: 'Remove a movie from the watchlist',
        security: [{ bearerAuth: [] }],
        parameters: [{ in: 'path', name: 'titleId', required: true, schema: { type: 'string' } }],
        responses: {
          '200': { description: 'Movie removed from watchlist' },
          '404': { description: 'Movie not in watchlist' },
          '401': { description: 'Unauthorized' }
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
      },
      User: {
        type: 'object',
        properties: { id: { type: 'integer' }, name: { type: 'string' }, email: { type: 'string' } }
      },
      Title: {
        type: 'object',
        properties: {
          tconst: { type: 'string' },
          titleType: { type: 'string' },
          primaryTitle: { type: 'string' },
          startYear: { type: 'string' },
          runtimeMinutes: { type: 'string' },
          genres: { type: 'string' },
          Rating: { $ref: '#/components/schemas/Rating' }
        }
      },
      Person: {
        type: 'object',
        properties: {
          nconst: { type: 'string' },
          primaryName: { type: 'string' },
          birthYear: { type: 'string' },
          primaryProfession: { type: 'string' }
        }
      },
      Rating: {
        type: 'object',
        properties: { averageRating: { type: 'number' }, numVotes: { type: 'integer' } }
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