const { authenticate, ValidationMiddleware } = require('../middleware/auth');
const UserController = require('../controllers/UserController');

async function usersRoutes(fastify, options) {
  fastify.get('/',{
    preHandler: authenticate 
  }, UserController.getUsers);

  fastify.get('/notifications',{
    preHandler: authenticate 
  }, UserController.getNotifications);

  fastify.post('/notifications', {
  preHandler: authenticate 
  }, UserController.addNotification);

  // Mark single notification as read
  fastify.put('/notifications/:id/read', 
    { preHandler: authenticate },
    UserController.markNotificationAsRead);

// Mark all as read
  fastify.put('/notifications/read-all', 
    { preHandler: authenticate }, 
    UserController.markAllNotificationsAsRead);

// Delete notification
  fastify.delete('/notifications/:id', 
    { preHandler: authenticate }, 
    UserController.deleteNotification);

}

module.exports = usersRoutes;