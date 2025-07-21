const FriendsController = require('../controllers/FriendsController');
const { authenticate } = require('../middleware/auth');

async function friendsRoutes(fastify, options) {
  // All friends routes require authentication
  fastify.addHook('preHandler', authenticate);

  // Search users to add as friends
  fastify.get('/search', FriendsController.searchUsers);

  // Send friend request
  fastify.post('/request', FriendsController.sendFriendRequest);

  // Accept friend request
  fastify.post('/accept', FriendsController.acceptFriendRequest);

  // Decline friend request
  fastify.post('/decline', FriendsController.declineFriendRequest);

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