const AuthController = require('../controllers/AuthController');
const { authenticate } = require('../middleware/auth');

async function authRoutes(fastify, options) {
  // Register
  fastify.post('/register', AuthController.register);

  // Login
  fastify.post('/login', AuthController.login);

  // Google OAuth verification
  fastify.post('/google/verify', AuthController.googleVerify);

  // Get current user (protected)
  fastify.get('/me', { preHandler: authenticate }, AuthController.getCurrentUser);

  // Update user profile (protected)
  fastify.put('/profile', { preHandler: authenticate }, AuthController.updateProfile);

  // Change password (protected)
  fastify.put('/password', { preHandler: authenticate }, AuthController.changePassword);

  // Logout (protected)
  fastify.post('/logout', { preHandler: authenticate }, AuthController.logout);

  // Get user stats (protected)
  fastify.get('/stats', { preHandler: authenticate }, AuthController.getStats);
}

module.exports = authRoutes;