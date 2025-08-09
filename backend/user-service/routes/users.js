const User = require('../models/User');
const UserStats = require('../models/UserStats');
const { authenticate } = require('../middleware/auth');

async function usersRoutes(fastify, options) {
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params;
    
    try {
      const user = await User.findById(id);
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found'
        });
      }
      
      return {
        success: true,
        data: { user: user.toJSON() }
      };
    } catch (error) {
      console.error('Get user error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to get user'
      });
    }
  });
  
  fastify.post('/batch', async (request, reply) => {
    const { userIds } = request.body;
    
    if (!userIds || !Array.isArray(userIds)) {
      return reply.code(400).send({
        success: false,
        error: 'userIds array is required'
      });
    }
    
    try {
      const users = [];
      for (const id of userIds) {
        const user = await User.findById(id);
        if (user) {
          users.push(user.toJSON());
        }
      }
      
      return {
        success: true,
        data: { users }
      };
    } catch (error) {
      console.error('Get batch users error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to get users'
      });
    }
  });
  
  fastify.get('/:id/stats', async (request, reply) => {
    const { id } = request.params;
    
    try {
      const stats = await UserStats.findByUserId(id);
      return {
        success: true,
        data: { stats: stats.toJSON() }
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to get user stats'
      });
    }
  });
  
  fastify.put('/:id/stats', async (request, reply) => {
    const { id } = request.params;
    const statsUpdate = request.body;
    
    try {
      const stats = await UserStats.findByUserId(id);
      const changes = await stats.update(statsUpdate);
      
      return {
        success: true,
        data: { 
          message: 'Stats updated successfully',
          stats: stats.toJSON()
        }
      };
    } catch (error) {
      console.error('Update user stats error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to update user stats'
      });
    }
  });
  
  fastify.put('/:id/status', async (request, reply) => {
    const { id } = request.params;
    const { isOnline } = request.body;
    
    try {
      const user = await User.findById(id);
      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found'
        });
      }
      
      await user.updateOnlineStatus(isOnline);
      
      return {
        success: true,
        data: { 
          message: 'Status updated successfully',
          isOnline: isOnline
        }
      };
    } catch (error) {
      console.error('Update user status error:', error);
      return reply.code(500).send({
        success: false,
        error: 'Failed to update user status'
      });
    }
  });
}

module.exports = usersRoutes;