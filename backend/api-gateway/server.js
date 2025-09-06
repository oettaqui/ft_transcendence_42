const fastify = require('fastify')({ logger: true });
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pingpong-secret-key-change-in-production';
const PORT = process.env.PORT || 3000;

const SERVICES = {
  USER_SERVICE: process.env.USER_SERVICE_URL || 'http://user-service:3001',
};

const clients = new Map();
const userSessions = new Map();

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
  prefix: '/health',
  rewritePrefix: '/health',
  http2: false
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

function broadcastToUser(userId, event) {
  const client = clients.get(userId);
  if (client && client.readyState === WebSocket.OPEN) {
    try {
      client.send(JSON.stringify(event));
      console.log(`📡 Event sent to user ${userId}:`, event.type);
    } catch (error) {
      console.error(`❌ Error sending to user ${userId}:`, error);
      clients.delete(userId);
      userSessions.delete(userId);
    }
  }
}

function broadcastToMultipleUsers(userIds, event) {
  userIds.forEach(userId => broadcastToUser(userId, event));
}

function broadcastToAllUsers(event) {
  clients.forEach((client, userId) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify(event));
      } catch (error) {
        console.error(`❌ Error broadcasting to user ${userId}:`, error);
        clients.delete(userId);
        userSessions.delete(userId);
      }
    }
  });
}

fastify.post('/api/ws/broadcast', async (request, reply) => {
  const { userId, userIds, event, broadcast } = request.body;
  
  if (!event || !event.type) {
    return reply.code(400).send({ error: 'Event type is required' });
  }

  try {
    if (broadcast === 'all') {
      broadcastToAllUsers(event);
    } else if (userIds && Array.isArray(userIds)) {
      broadcastToMultipleUsers(userIds, event);
    } else if (userId) {
      broadcastToUser(userId, event);
    } else {
      return reply.code(400).send({ error: 'No target specified' });
    }
    
    reply.send({ success: true, message: 'Event broadcasted' });
  } catch (error) {
    console.error('❌ Broadcast error:', error);
    reply.code(500).send({ error: 'Failed to broadcast event' });
  }
});

fastify.get('/api/ws/online-users', async (request, reply) => {
  const onlineUsers = Array.from(userSessions.values());
  reply.send({ onlineUsers, count: onlineUsers.length });
});

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function setupWebSocketServer(server) {
  try {
    const wss = new WebSocket.Server({ 
      server: server,
      path: '/ws',
    verifyClient: (info) => {
      const url = new URL(info.req.url, 'http://localhost');
      const token = url.searchParams.get('token') || 
                   info.req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        console.log('❌ WebSocket connection rejected: No token provided');
        return false;
      }
      
      const decoded = verifyToken(token);
      if (!decoded) {
        console.log('❌ WebSocket connection rejected: Invalid token');
        return false;
      }

      info.req.user = decoded;
      return true;
    }
  });

  wss.on('connection', (ws, req) => {
    const user = req.user;
    const userId = user.id || user.userId;
    
    console.log(`🔌 User ${userId} connected to WebSocket`);

    clients.set(userId, ws);
    userSessions.set(userId, {
      userId: userId,
      username: user.username,
      connectedAt: new Date().toISOString(),
      status: 'online'
    });

    ws.send(JSON.stringify({
      type: 'connection_established',
      data: {
        message: 'Connected to real-time updates',
        userId: userId,
        timestamp: new Date().toISOString()
      }
    }));

    broadcastUserStatusChange(userId, 'online');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log(`📨 Message from user ${userId}:`, data);
        
        // Handle different message types
        switch (data.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
            break;
          case 'status_update':
            updateUserStatus(userId, data.status);
            break;
          default:
            console.log(`❓ Unknown message type: ${data.type}`);
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log(`🔌 User ${userId} disconnected from WebSocket`);
      clients.delete(userId);
      userSessions.delete(userId);
      broadcastUserStatusChange(userId, 'offline');
    });
    ws.on('error', (error) => {
      console.error(`❌ WebSocket error for user ${userId}:`, error);
      clients.delete(userId);
      userSessions.delete(userId);
    });
  });

  console.log(`🚀 WebSocket server running on ws://localhost:${PORT}/ws`);
  return wss;
  } catch (error) {
    console.error(`❌ Failed to start WebSocket server:`, error.message);
    console.log(`💡 Check if HTTP server is running properly`);
    throw error;
  }
}

function broadcastUserStatusChange(userId, status) {
  const event = {
    type: 'user_status_changed',
    data: {
      userId: userId,
      status: status,
      timestamp: new Date().toISOString()
    }
  };
  console.log(`📢 User ${userId} is now ${status}`);
}

function updateUserStatus(userId, status) {
  const session = userSessions.get(userId);
  if (session) {
    session.status = status;
    broadcastUserStatusChange(userId, status);
  }
}

fastify.get('/health_gateway', async (request, reply) => {
  return { 
    status: 'OK', 
    service: 'api-gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    websocket: {
      endpoint: `/ws`,
      connectedClients: clients.size
    }
  };
});

fastify.get('/services/health', async (request, reply) => {
  const axios = require('axios');
  const services = {};
  
  for (const [name, url] of Object.entries(SERVICES)) {
    console.log(`url ===== > ${url}`);
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
    websocket: {
      status: 'running',
      endpoint: `/ws`,
      connectedClients: clients.size
    },
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
      'Load Balancing',
      'Real-time WebSocket Communication'
    ],
    routes: {
      auth: '/api/auth/* → user-service',
      users: '/api/users/* → user-service', 
      friends: '/api/friends/* → user-service',
      games: '/api/games/* → game-service',
      matches: '/api/matches/* → match-service'
    },
    websocket: {
      endpoint: `ws://localhost:${PORT}/ws`,
      connectedClients: clients.size
    },
    endpoints: [
      'GET /health - Gateway health check',
      'GET /services/health - All services health',
      'GET /info - This information',
      'POST /api/ws/broadcast - Broadcast events to users',
      'GET /api/ws/online-users - Get online users list'
    ]
  };
});

process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down API Gateway...');
  try {
    clients.forEach((client, userId) => {
      if (client.readyState === WebSocket.OPEN) {
        client.close(1000, 'Server shutting down');
      }
    });
    
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
    setupWebSocketServer(fastify.server);
    
    console.log(`🌐 API Gateway running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket server running on ws://localhost:${PORT}/ws`);
    console.log('📊 Health check: http://localhost:' + PORT + '/health');
    console.log('🔍 Services health: http://localhost:' + PORT + '/services/health');
    console.log('ℹ️  Gateway info: http://localhost:' + PORT + '/info');
    console.log('🚀 Ready to route requests and handle real-time connections!');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();