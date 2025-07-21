const AuthController = require('../controllers/AuthController');
const { authenticate } = require('../middleware/auth');
const ValidationMiddleware = require('../middleware/validation');

async function authRoutes(fastify, options) {
  // Register with validation
  fastify.post('/register', {
    preHandler: ValidationMiddleware.validateRegistration
  }, AuthController.register);

  // Login with validation
  fastify.post('/login', {
    preHandler: ValidationMiddleware.validateLogin
  }, AuthController.login);

  // Google OAuth verification (no validation needed for token)
  fastify.post('/google/verify', AuthController.googleVerify);

  // Get current user (protected)
  fastify.get('/me', { 
    preHandler: authenticate 
  }, AuthController.getCurrentUser);

  // Update user profile (protected + validated)
  fastify.put('/profile', { 
    preHandler: [authenticate, ValidationMiddleware.validateProfileUpdate]
  }, AuthController.updateProfile);

  // Change password (protected)
  fastify.put('/password', { 
    preHandler: authenticate 
  }, AuthController.changePassword);

  // Logout (protected)
  fastify.post('/logout', { 
    preHandler: authenticate 
  }, AuthController.logout);

  // Get user stats (protected)
  fastify.get('/stats', { 
    preHandler: authenticate 
  }, AuthController.getStats);
}

module.exports = authRoutes;