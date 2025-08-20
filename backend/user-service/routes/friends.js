const FriendsController = require('../controllers/FriendsController');
const { authenticate, ValidationMiddleware } = require('../middleware/auth');

async function friendsRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  http://localhost:3001/api/friends/search?search_value=ba
  fastify.get('/search', {
    preHandler: ValidationMiddleware.validateSearch
  }, FriendsController.searchUsers);

  fastify.post('/request', {
    preHandler: ValidationMiddleware.validateFriendRequest
  }, FriendsController.sendFriendRequest);

  fastify.post('/accept', {
    preHandler: ValidationMiddleware.validateFriendRequest
  }, FriendsController.acceptFriendRequest);

  fastify.post('/decline', {
    preHandler: ValidationMiddleware.validateFriendRequest
  }, FriendsController.declineFriendRequest);

  fastify.delete('/request/:friendId', FriendsController.cancelFriendRequest);

  fastify.delete('/:friendId', FriendsController.removeFriend);

  fastify.get('/', FriendsController.getFriends);

  fastify.get('/requests/pending', FriendsController.getPendingRequests);

  fastify.get('/requests/sent', FriendsController.getSentRequests);

  fastify.get('/status/:friendId', FriendsController.getFriendshipStatus);

  fastify.put('/status/online', FriendsController.updateOnlineStatus);
}

module.exports = friendsRoutes;