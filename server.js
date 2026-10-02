const fastify = require('fastify')({ logger: false });
fastify.register(require('@fastify/formbody'));
fastify.register(require('@fastify/static'), { root: require('path').join(__dirname, 'public') });
fastify.register(require('./routes/rutas'));

function iniciar(p) {
  fastify.listen({ port: p, host: '0.0.0.0' }, (err, addr) => {
    if (err) {
      if (err.code === 'EADDRINUSE') iniciar(p + 1);
      else process.exit(1);
    } else {
      console.log('\n==================================================================');
      console.log('🏛️  CENTRO TECNOLÓGICO MUNICIPAL INICIALIZADO (MODULAR)');
      console.log('🔗 ENTRA EN TU NAVEGADOR DESDE: ' + addr);
      console.log('==================================================================\n');
    }
  });
}
fastify.get('/', async (req, res) => res.redirect('/index.html'));
iniciar(3000);