// chat-service/server.js - Real-time Chat and Messaging Service
const fastify = require('fastify')({ logger: true });
const { initDatabase, closeDatabase } = require('./config/database');
const axios = require('axios');

const PORT = process.env.PORT || 3003;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';

// CORS configuration
fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
});

// WebSocket support for real-time chat
fastify.register(require('@fastify/websocket'));

// Store active connections
const activeConnections = new Map();

// Authentication middleware
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
fastify.register(require('./routes/chat'), { prefix: '/api/chat' });
fastify.register(require('./routes/messages'), { prefix: '/api/messages' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'OK', 
    service: 'chat-service',
    timestamp: new Date().toISOString(),
    activeConnections: activeConnections.size
  };
});

// Service info endpoint
fastify.get('/info', async (request, reply) => {
  return {
    service: 'Chat Service',
    version: '1.0.0',
    features: [
      'Real-time Messaging',
      'Direct Messages',
      'Tournament Notifications',
      'User Blocking',
      'Message History',
      'Online Status'
    ],
    endpoints: [
      'POST /api/chat/send',
      'GET /api/chat/history',
      'POST /api/chat/block',
      'DELETE /api/chat/block/:userId',
      'GET /api/messages/direct/:userId',
      'POST /api/messages/invite'
    ]
  };
});

// WebSocket for real-time chat
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, async (connection, req) => {
    console.log('Chat WebSocket connection established');
    
    // Store connection with user info (would need authentication here)
    const connectionId = generateConnectionId();
    activeConnections.set(connectionId, {
      socket: connection.socket,
      userId: null, // Will be set after authentication
      joinedAt: new Date()
    });

    connection.socket.on('message', async message => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Chat message received:', data);
        
        // Handle different chat events
        switch (data.type) {
          case 'authenticate':
            await handleAuthentication(connection, data, connectionId);
            break;
          case 'send_message':
            await handleSendMessage(connection, data, connectionId);
            break;
          case 'join_room':
            await handleJoinRoom(connection, data, connectionId);
            break;
          case 'leave_room':
            await handleLeaveRoom(connection, data, connectionId);
            break;
          case 'typing':
            await handleTyping(connection, data, connectionId);
            break;
          case 'game_invite':
            await handleGameInvite(connection, data, connectionId);
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
      console.log('Chat WebSocket connection closed');
      activeConnections.delete(connectionId);
    });
  });
});

// Chat WebSocket handlers
async function handleAuthentication(connection, data, connectionId) {
  try {
    // Verify token with auth service
    const response = await axios.get(`${AUTH_SERVICE_URL}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${data.token}` }
    });

    const connectionInfo = activeConnections.get(connectionId);
    connectionInfo.userId = response.data.user.id;
    connectionInfo.user = response.data.user;

    connection.socket.send(JSON.stringify({
      type: 'authenticated',
      user: response.data.user
    }));

    // Broadcast user online status
    broadcastToAll({
      type: 'user_online',
      userId: response.data.user.id,
      username: response.data.user.username
    }, connectionId);

  } catch (error) {
    connection.socket.send(JSON.stringify({
      type: 'auth_error',
      message: 'Authentication failed'
    }));
  }
}

async function handleSendMessage(connection, data, connectionId) {
  const connectionInfo = activeConnections.get(connectionId);
  if (!connectionInfo.userId) {
    connection.socket.send(JSON.stringify({
      type: 'error',
      message: 'Not authenticated'
    }));
    return;
  }

  // Save message to database (implement based on your model)
  const message = {
    id: generateMessageId(),
    from: connectionInfo.userId,
    to: data.to,
    content: data.content,
    timestamp: new Date().toISOString(),
    type: data.messageType || 'direct'
  };

  // Send to recipient if online
  if (data.to) {
    const recipientConnection = findConnectionByUserId(data.to);
    if (recipientConnection) {
      recipientConnection.socket.send(JSON.stringify({
        type: 'new_message',
        message: message
      }));
    }
  }

  // Confirm to sender
  connection.socket.send(JSON.stringify({
    type: 'message_sent',
    message: message
  }));
}

async function handleJoinRoom(connection, data, connectionId) {
  const connectionInfo = activeConnections.get(connectionId);
  connectionInfo.room = data.room;

  connection.socket.send(JSON.stringify({
    type: 'room_joined',
    room: data.room
  }));
}

async function handleLeaveRoom(connection, data, connectionId) {
  const connectionInfo = activeConnections.get(connectionId);
  connectionInfo.room = null;

  connection.socket.send(JSON.stringify({
    type: 'room_left',
    room: data.room
  }));
}

async function handleTyping(connection, data, connectionId) {
  // Broadcast typing indicator to recipient
  if (data.to) {
    const recipientConnection = findConnectionByUserId(data.to);
    if (recipientConnection) {
      recipientConnection.socket.send(JSON.stringify({
        type: 'user_typing',
        from: activeConnections.get(connectionId).userId,
        isTyping: data.isTyping
      }));
    }
  }
}

async function handleGameInvite(connection, data, connectionId) {
  const connectionInfo = activeConnections.get(connectionId);
  
  // Send game invite to recipient
  if (data.to) {
    const recipientConnection = findConnectionByUserId(data.to);
    if (recipientConnection) {
      recipientConnection.socket.send(JSON.stringify({
        type: 'game_invite',
        from: connectionInfo.user,
        gameType: data.gameType || 'pong',
        inviteId: generateInviteId()
      }));
    }
  }
}

// Utility functions
function generateConnectionId() {
  return Math.random().toString(36).substr(2, 9);
}

function generateMessageId() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

function generateInviteId() {
  return 'invite_' + Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

function findConnectionByUserId(userId) {
  for (const [id, connection] of activeConnections) {
    if (connection.userId === userId) {
      return connection;
    }
  }
  return null;
}

function broadcastToAll(message, excludeConnectionId = null) {
  for (const [id, connection] of activeConnections) {
    if (id !== excludeConnectionId && connection.socket.readyState === 1) {
      connection.socket.send(JSON.stringify(message));
    }
  }
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
  console.log('\n🛑 Shutting down Chat Service...');
  try {
    // Close all WebSocket connections
    for (const [id, connection] of activeConnections) {
      connection.socket.close();
    }
    activeConnections.clear();
    
    await closeDatabase();
    await fastify.close();
    console.log('✅ Chat Service shutdown complete');
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
    console.log(`💬 Chat Service running on http://localhost:${PORT}`);
    console.log('📊 Health check: http://localhost:' + PORT + '/health');
    console.log('ℹ️  Service info: http://localhost:' + PORT + '/info');
    console.log('🔌 WebSocket: ws://localhost:' + PORT + '/ws');
    console.log('💭 Features: Real-time Chat, Messages, Notifications');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();