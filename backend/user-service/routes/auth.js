const AuthController = require('../controllers/AuthController');
const { authenticate, ValidationMiddleware } = require('../middleware/auth');

async function authRoutes(fastify, options) {
  fastify.post('/register', {
    preHandler: ValidationMiddleware.validateRegistration
  }, AuthController.register);

  fastify.post('/login', {
    preHandler: ValidationMiddleware.validateLogin
  }, AuthController.login);

  fastify.post('/google/verify', AuthController.googleVerify);

  fastify.get('/verify-email/:token', AuthController.verifyEmail);
  
  fastify.post('/resend-verification', { 
    preHandler: authenticate 
  }, AuthController.resendVerificationEmail);

  fastify.post('/resend-verification-public', AuthController.resendVerificationEmailPublic);

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

  fastify.get('/me', { 
    preHandler: authenticate 
  }, AuthController.getCurrentUser);

  fastify.put('/profile', { 
    preHandler: [authenticate, ValidationMiddleware.validateProfileUpdate]
  }, AuthController.updateProfile);

  fastify.put('/password', { 
    preHandler: authenticate 
  }, AuthController.changePassword);

  fastify.post('/logout', { 
    preHandler: authenticate 
  }, AuthController.logout);

  fastify.get('/stats', { 
    preHandler: authenticate 
  }, AuthController.getStats);

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