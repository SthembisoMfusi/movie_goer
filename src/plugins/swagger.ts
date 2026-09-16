import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import type { FastifyInstance } from 'fastify';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

async function swaggerConfig(fastify: FastifyInstance){
  const yamlPath = path.join(process.cwd(), 'openapi.yml');
  const yamlFile = fs.readFileSync(yamlPath, 'utf8');
  const openApiDoc = yaml.parse(yamlFile);

  await fastify.register(fastifySwagger, {
    mode: 'static',
    specification: {
      document: openApiDoc
    }
  });

  await fastify.register(fastifySwaggerUi,{
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });
}

export default fp(swaggerConfig)