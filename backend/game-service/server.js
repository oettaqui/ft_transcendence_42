const fastify = require('fastify')({ logger: true });
const { initDatabase, closeDatabase } = require('./config/database');


const JWT_SECRET = process.env.JWT_SECRET || 'pingpong-secret-key-change-in-production';
const PORT = process.env.PORT || 3001;

fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Cross-Origin-Opener-Policy']
});

fastify.register(require('@fastify/jwt'), {
  secret: JWT_SECRET
});

// routes
//fastify.register....

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down Auth Service...');
  try {
    await closeDatabase();
    await fastify.close();
    console.log('✅ Auth Service shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
});

const start = async () => {
  try{
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🔒 Auth Service running on http://localhost:${PORT}`);
    // console.log('📊 Health check: http://localhost:' + PORT + '/health');
    // console.log('ℹ️  Service info: http://localhost:' + PORT + '/info');
  }catch (err){
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

module.exports = fastify;