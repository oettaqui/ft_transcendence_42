const fastify = require('fastify')({ logger: true });

const JWT_SECRET = process.env.JWT_SECRET || 'pingpong-secret-key-change-in-production';
const PORT = process.env.PORT || 3000;

const SERVICES = {
  USER_SERVICE: process.env.USER_SERVICE_URL || 'http://user-service:3001',
};

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

fastify.register(require('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
});

fastify.register(require('@fastify/http-proxy'), {
  upstream: SERVICES.USER_SERVICE,
  prefix: '/api/auth',
  rewritePrefix: '/api/auth',
  http2: false
});

fastify.register(require('@fastify/http-proxy'), {
  upstream: SERVICES.USER_SERVICE,
  prefix: '/api/friends',
  rewritePrefix: '/api/friends',
  http2: false
});

fastify.register(require('@fastify/http-proxy'), {
  upstream: SERVICES.USER_SERVICE,
  prefix: '/api/users',
  rewritePrefix: '/api/users',
  http2: false
});

fastify.get('/health', async (request, reply) => {
  return { 
    status: 'OK', 
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };
});

fastify.get('/services/health', async (request, reply) => {
  const axios = require('axios');
  const services = {};
  
  for (const [name, url] of Object.entries(SERVICES)) {
    try {
      const response = await axios.get(`${url}/health`, { timeout: 5000 });
      services[name.toLowerCase()] = {
        status: 'healthy',
        url: url,
        response: response.data
      };
    } catch (error) {
      services[name.toLowerCase()] = {
        status: 'unhealthy',
        url: url,
        error: error.message
      };
    }
  }
  return {
    gateway: 'healthy',
    services: services,
    timestamp: new Date().toISOString()
  };
});

fastify.get('/info', async (request, reply) => {
  return {
    service: 'Transcendence API Gateway',
    version: '1.0.0',
    description: 'Central API Gateway for Transcendence Pong Game microservices',
    features: [
      'Request Routing',
      'Rate Limiting',
      'Service Health Monitoring',
      'CORS Handling',
      'Load Balancing'
    ],
    routes: {
      auth: '/api/auth/* → user-service',
      users: '/api/users/* → user-service', 
      friends: '/api/friends/* → user-service',
      games: '/api/games/* → game-service',
      matches: '/api/matches/* → match-service'
    },
    endpoints: [
      'GET /health - Gateway health check',
      'GET /services/health - All services health',
      'GET /info - This information'
    ]
  };
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down API Gateway...');
  try {
    await fastify.close();
    console.log('✅ API Gateway shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
});

const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🌐 API Gateway running on http://localhost:${PORT}`);
    console.log('📊 Health check: http://localhost:' + PORT + '/health');
    console.log('🔍 Services health: http://localhost:' + PORT + '/services/health');
    console.log('ℹ️  Gateway info: http://localhost:' + PORT + '/info');
    console.log('🚀 Ready to route requests to microservices!');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();