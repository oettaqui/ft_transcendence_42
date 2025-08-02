const AuthController = require('../controllers/AuthController');
const { authenticate, ValidationMiddleware } = require('../middleware/auth');

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

  // Intra OAuth routes
  fastify.get('/intra/url', AuthController.intraAuthUrl);
  fastify.post('/intra/callback', AuthController.intraCallback);

  // Email verification routes
  fastify.get('/verify-email/:token', AuthController.verifyEmail);
  
  fastify.post('/resend-verification', { 
    preHandler: authenticate 
  }, AuthController.resendVerificationEmail);

  fastify.post('/resend-verification-public', AuthController.resendVerificationEmailPublic);

  // 2FA routes
  fastify.get('/2fa/status', { 
    preHandler: authenticate 
  }, AuthController.get2FAStatus);
  
  fastify.post('/2fa/enable', { 
    preHandler: authenticate 
  }, AuthController.enable2FA);
  
  fastify.post('/2fa/disable', { 
    preHandler: authenticate 
  }, AuthController.disable2FA);
  
  fastify.post('/2fa/backup-codes', { 
    preHandler: authenticate 
  }, AuthController.generateNewBackupCodes);

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

  // JWT verification endpoint for other services
  fastify.get('/verify', { 
    preHandler: authenticate 
  }, async (request, reply) => {
    return {
      valid: true,
      user: request.user.toJSON()
    };
  });
}

module.exports = authRoutes;