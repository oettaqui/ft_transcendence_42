const FriendsController = require('../controllers/FriendsController');
const { authenticate } = require('../middleware/auth');
const ValidationMiddleware = require('../middleware/validation');

async function friendsRoutes(fastify, options) {
  // All friends routes require authentication
  fastify.addHook('preHandler', authenticate);

  // Search users with validation
  fastify.get('/search', {
    preHandler: ValidationMiddleware.validateSearch
  }, FriendsController.searchUsers);

  // Send friend request with validation
  fastify.post('/request', {
    preHandler: ValidationMiddleware.validateFriendRequest
  }, FriendsController.sendFriendRequest);

  // Accept friend request with validation
  fastify.post('/accept', {
    preHandler: ValidationMiddleware.validateFriendRequest
  }, FriendsController.acceptFriendRequest);

  // Decline friend request with validation
  fastify.post('/decline', {
    preHandler: ValidationMiddleware.validateFriendRequest
  }, FriendsController.declineFriendRequest);

  // Cancel sent friend request
  fastify.delete('/request/:friendId', FriendsController.cancelFriendRequest);

  // Remove friend (unfriend)
  fastify.delete('/:friendId', FriendsController.removeFriend);

  // Get friends list
  fastify.get('/', FriendsController.getFriends);

  // Get pending friend requests (received)
  fastify.get('/requests/pending', FriendsController.getPendingRequests);

  // Get sent friend requests
  fastify.get('/requests/sent', FriendsController.getSentRequests);

  // Get friendship status with specific user
  fastify.get('/status/:friendId', FriendsController.getFriendshipStatus);

  // Update online status
  fastify.put('/status/online', FriendsController.updateOnlineStatus);
}

module.exports = friendsRoutes;