// server.js - Ping Pong Game Authentication Server (MVC Structure)
const fastify = require('fastify')({ logger: true });
const { initDatabase, closeDatabase } = require('./config/database');

// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'pingpong-secret-key-change-in-production';

// CORS configuration
fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Cross-Origin-Opener-Policy']
});

// Register JWT plugin
fastify.register(require('@fastify/jwt'), {
  secret: JWT_SECRET
});

// Register routes
fastify.register(require('./routes/auth'), { prefix: '/api/auth' });
fastify.register(require('./routes/friends'), { prefix: '/api/friends' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});

// Initialize database on startup
fastify.ready().then(() => {
  initDatabase();
})
.catch(err => {
  console.error('Error during Fastify initialization:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  try {
    await closeDatabase();
    await fastify.close();
    console.log('✅ Server shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🏓 Ping Pong Game Authentication Server is running on http://localhost:3000');
    console.log('📊 Health check available at: http://localhost:3000/health');
    console.log('🔧 Server structured with MVC pattern');
    console.log('📁 Models: User, UserStats, Friendship');
    console.log('🎮 Controllers: AuthController, FriendsController');
    console.log('🛣️  Routes: /api/auth/*, /api/friends/*');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();