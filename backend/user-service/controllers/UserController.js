const User = require('../models/User');
const UserStats = require('../models/UserStats');

class UserController {
static async getUsers(request, reply) {
  console.log("============ getUsers process begin ==========");
  try {
    const currentUserId = request.user.id;
    const users = await User.getAllUsers(currentUserId);
    const onlineCount = await User.getOnlineUsersCount(currentUserId);
    
    const formattedUsers = users.map(user => ({
      id: user.id,
      username: user.username,
      firstName: user.first_name || user.firstName,
      lastName: user.last_name || user.lastName,
      avatar: user.avatar,
      coalition: user.coalition,
      colorTheme: user.color_theme || user.colorTheme,
      isOnline: Boolean(user.is_online || user.isOnline),
      lastLogin: user.last_login || user.lastLogin,
      createdAt: user.created_at || user.createdAt,
      emailVerified: Boolean(user.email_verified || user.emailVerified)
    }));
    
    return {
      success: true,
      data: {
        users: formattedUsers,
        totalUsers: users.length,
        onlineUsers: onlineCount
      }
    };
  } catch (error) {
    console.error('Get users error:', error);
    return reply.code(500).send({ 
      success: false, 
      error: 'Failed to get users list' 
    });
  }
}
}
module.exports = UserController;