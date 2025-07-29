// user-service/server.js - Authentication and User Management Service
const fastify = require('fastify')({ logger: true });
const { initDatabase, closeDatabase } = require('./config/database');

// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'pingpong-secret-key-change-in-production';
const PORT = process.env.PORT || 3001;

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
fastify.register(require('./routes/users'), { prefix: '/api/users' });

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { 
    status: 'OK', 
    service: 'user-service',
    timestamp: new Date().toISOString() 
  };
});

// Service info endpoint
fastify.get('/info', async (request, reply) => {
  return {
    service: 'Authentication Service',
    version: '1.0.0',
    features: [
      'User Registration & Login',
      'Email Verification',
      'Two-Factor Authentication (2FA)',
      'JWT Token Management',
      'Friend System',
      'User Profiles',
      'User Statistics'
    ],
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/verify-email/:token',
      'POST /api/auth/resend-verification',
      'GET /api/auth/2fa/status',
      'POST /api/auth/2fa/enable',
      'POST /api/auth/2fa/disable',
      'GET /api/auth/me',
      'PUT /api/auth/profile',
      'GET /api/friends',
      'POST /api/friends/add',
      'DELETE /api/friends/:id',
      'GET /api/users/stats'
    ]
  };
});

// Initialize database on startup
fastify.ready().then(async () => {
  try {
    await initDatabase();
    console.log('🗄️  Database initialized with email verification and 2FA support');
    
    // Test email service if EmailService exists
    try {
      const EmailService = require('./services/EmailService');
      const emailReady = await EmailService.testConnection();
      if (emailReady) {
        console.log('📧 Email service is ready');
      } else {
        console.warn('⚠️  Email service configuration issue - check your EMAIL_USER and EMAIL_APP_PASSWORD');
      }
    } catch (emailError) {
      console.warn('⚠️  EmailService not found or configured. Email features will be disabled.');
      console.warn('   Please create services/EmailService.js and configure email settings in .env');
    }
  } catch (err) {
    console.error('Error during initialization:', err);
  }
})
.catch(err => {
  console.error('Error during Fastify initialization:', err);
});

// Graceful shutdown
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

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    console.log(`🔒 Auth Service running on http://localhost:${PORT}`);
    console.log('📊 Health check: http://localhost:' + PORT + '/health');
    console.log('ℹ️  Service info: http://localhost:' + PORT + '/info');
    console.log('🔧 Features: Authentication, Email Verification, 2FA, User Management, Friends');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();