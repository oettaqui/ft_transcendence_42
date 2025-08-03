// game-service/server.js - Game Logic and Tournament Management Service
const fastify = require('fastify')({ logger: true });
const { initDatabase, closeDatabase } = require('./config/database');
const axios = require('axios');

const PORT = process.env.PORT || 3002;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

// CORS configuration
fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
});

// WebSocket support for real-time game
fastify.register(require('@fastify/websocket'));

// Authentication middleware - verify with auth service
async function authenticate(request, reply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return reply.code(401).send({ error: 'No token provided' });
    }

    const response = await axios.get(`${AUTH_SERVICE_URL}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    request.user = response.data.user;
  } catch (error) {
    return reply.code(401).send({ error: 'Invalid token' });
  }
}

// Register routes
fastify.register(require('./routes/game'), { prefix: '/api/game' });
fastify.register(require('./routes/tournaments'), { prefix: '/api/tournaments' });
fastify.register(require('./routes/matchmaking'), { prefix: '/api/matchmaking' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'OK', 
    service: 'game-service',
    timestamp: new Date().toISOString() 
  };
});

// Service info endpoint
fastify.get('/info', async (request, reply) => {
  return {
    service: 'Game Service',
    version: '1.0.0',
    features: [
      'Pong Game Logic',
      'Tournament Management',
      'Matchmaking System',
      'Game History',
      'Real-time Gameplay',
      'Game Statistics'
    ],
    endpoints: [
      'POST /api/game/create',
      'GET /api/game/:id',
      'POST /api/game/:id/join',
      'POST /api/tournaments/create',
      'GET /api/tournaments',
      'POST /api/matchmaking/find',
      'GET /api/game/history'
    ]
  };
});

// WebSocket for real-time game
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    console.log('Game WebSocket connection established');
    
    connection.socket.on('message', message => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Game message received:', data);
        
        // Handle different game events
        switch (data.type) {
          case 'join_game':
            handleJoinGame(connection, data);
            break;
          case 'player_move':
            handlePlayerMove(connection, data);
            break;
          case 'game_start':
            handleGameStart(connection, data);
            break;
          default:
            connection.socket.send(JSON.stringify({
              type: 'error',
              message: 'Unknown message type'
            }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        connection.socket.send(JSON.stringify({
          type: 'error',
          message: 'Invalid message format'
        }));
      }
    });

    connection.socket.on('close', () => {
      console.log('Game WebSocket connection closed');
    });
  });
});

// Game WebSocket handlers
function handleJoinGame(connection, data) {
  // Game join logic
  connection.socket.send(JSON.stringify({
    type: 'game_joined',
    gameId: data.gameId,
    playerId: data.playerId
  }));
}

function handlePlayerMove(connection, data) {
  // Handle player paddle movement
  // Broadcast to other players in the same game
  connection.socket.send(JSON.stringify({
    type: 'player_moved',
    playerId: data.playerId,
    position: data.position
  }));
}

function handleGameStart(connection, data) {
  // Start game logic
  connection.socket.send(JSON.stringify({
    type: 'game_started',
    gameId: data.gameId,
    timestamp: new Date().toISOString()
  }));
}

// Initialize database on startup
fastify.ready().then(() => {
  initDatabase();
})
.catch(err => {
  console.error('Error during Fastify initialization:', err);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down Game Service...');
  try {
    await closeDatabase();
    await fastify.close();
    console.log('✅ Game Service shutdown complete');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
});

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🎮 Game Service running on http://localhost:${PORT}`);
    console.log('📊 Health check: http://localhost:' + PORT + '/health');
    console.log('ℹ️  Service info: http://localhost:' + PORT + '/info');
    console.log('🎯 Features: Pong Game, Tournaments, Matchmaking');
    console.log('🔌 WebSocket: ws://localhost:' + PORT + '/ws');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();