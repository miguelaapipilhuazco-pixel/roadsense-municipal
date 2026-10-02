const fastify = require('fastify')({ logger: false });

fastify.register(require('@fastify/formbody'));
fastify.register(require('./routes/rutas'));

// Adaptador para correr Fastify dentro de Vercel Serverless
async function handler(req, res) {
  await fastify.ready();
  fastify.server.emit('request', req, res);
}

module.exports = handler;
