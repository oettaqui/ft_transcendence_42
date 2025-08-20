const { authenticate, ValidationMiddleware } = require('../middleware/auth');
const UserController = require('../controllers/UserController');

async function usersRoutes(fastify, options) {
  fastify.get('/',{
    preHandler: authenticate 
  }, UserController.getUsers);

}

module.exports = usersRoutes;