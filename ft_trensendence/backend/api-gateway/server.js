// api-gateway/server.js - API Gateway for Transcendence
const fastify = require('fastify')({ logger: true });
const axios = require('axios');

// Environment variables
const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const GAME_SERVICE_URL = process.env.GAME_SERVICE_URL || 'http://localhost:3002';
const CHAT_SERVICE_URL = process.env.CHAT_SERVICE_URL || 'http://localhost:3003';

// CORS configuration
fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Cross-Origin-Opener-Policy']
});

// Register WebSocket support for real-time features
fastify.register(require('@fastify/websocket'));

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  try {
    // Check all services health
    const [authHealth, gameHealth, chatHealth] = await Promise.allSettled([
      axios.get(`${AUTH_SERVICE_URL}/health`, { timeout: 2000 }),
      axios.get(`${GAME_SERVICE_URL}/health`, { timeout: 2000 }),
      axios.get(`${CHAT_SERVICE_URL}/health`, { timeout: 2000 })
    ]);

    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      services: {
        auth: authHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        game: gameHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy',
        chat: chatHealth.status === 'fulfilled' ? 'healthy' : 'unhealthy'
      }
    };
  } catch (error) {
    return {
      status: 'PARTIAL',
      timestamp: new Date().toISOString(),
      error: 'Some services may be unavailable'
    };
  }
});

// Proxy function for HTTP requests
async function proxyRequest(request, reply, serviceUrl) {
  try {
    const config = {
      method: request.method,
      url: `${serviceUrl}${request.url}`,
      headers: { ...request.headers },
      timeout: 10000
    };

    // Include body for non-GET requests
    if (request.method !== 'GET' && request.body) {
      config.data = request.body;
    }

    delete config.headers.host;
    delete config.headers['content-length'];

    const response = await axios(config);
    
    // Forward response headers
    Object.entries(response.headers).forEach(([key, value]) => {
      if (!['content-encoding', 'transfer-encoding'].includes(key.toLowerCase())) {
        reply.header(key, value);
      }
    });

    reply.code(response.status).send(response.data);
  } catch (error) {
    fastify.log.error('Proxy error:', error.message);
    
    if (error.response) {
      reply.code(error.response.status).send(error.response.data);
    } else {
      reply.code(503).send({ 
        error: 'Service Unavailable', 
        message: 'The requested service is currently unavailable' 
      });
    }
  }
}

// Auth service routes
fastify.all('/api/auth/*', async (request, reply) => {
  await proxyRequest(request, reply, AUTH_SERVICE_URL);
});

// Game service routes
fastify.all('/api/game/*', async (request, reply) => {
  await proxyRequest(request, reply, GAME_SERVICE_URL);
});

fastify.all('/api/tournaments/*', async (request, reply) => {
  await proxyRequest(request, reply, GAME_SERVICE_URL);
});

// Chat service routes
fastify.all('/api/chat/*', async (request, reply) => {
  await proxyRequest(request, reply, CHAT_SERVICE_URL);
});

// WebSocket proxy for real-time game and chat
fastify.register(async function (fastify) {
  fastify.get('/ws/game', { websocket: true }, (connection, req) => {
    // Proxy WebSocket connections to game service
    // Implementation depends on your WebSocket library
    connection.socket.on('message', message => {
      // Forward to game service WebSocket
      console.log('Game WebSocket message:', message.toString());
    });
  });

  fastify.get('/ws/chat', { websocket: true }, (connection, req) => {
    // Proxy WebSocket connections to chat service
    connection.socket.on('message', message => {
      // Forward to chat service WebSocket
      console.log('Chat WebSocket message:', message.toString());
    });
  });
});

// Friends routes (part of auth service)
fastify.all('/api/friends/*', async (request, reply) => {
  await proxyRequest(request, reply, AUTH_SERVICE_URL);
});

// Rate limiting middleware
fastify.register(require('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute'
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🌐 API Gateway running on http://localhost:${PORT}`);
    console.log(`🔒 Auth Service: ${AUTH_SERVICE_URL}`);
    console.log(`🎮 Game Service: ${GAME_SERVICE_URL}`);
    console.log(`💬 Chat Service: ${CHAT_SERVICE_URL}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();