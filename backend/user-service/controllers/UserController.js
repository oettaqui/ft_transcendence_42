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

//   static async getUserProfileById(request, reply) {
//     try {
//       // It only needs the ID of the profile we want to view
//       const profileId = request.params.id;
//       const profileData = await User.findProfileById(profileId);

//       if (!profileData) {
//         return reply.code(404).send({ success: false, error: 'User not found' });
//       }

//       // Calculate win rate safely
//       let winRate = 0;
//       if (profileData.games_played > 0) {
//         winRate = (profileData.games_won / profileData.games_played) * 100;
//       }
      
//       // Structure the final response
//       const userProfile = {
//         id: profileData.id,
//         firstName: profileData.first_name,
//         lastName: profileData.last_name,
//         username: profileData.username,
//         coalition: profileData.coalition,
//         avatar: profileData.avatar,
//         createdAt: profileData.created_at,
//         stats: {
//           gamesPlayed: profileData.games_played,
//           gamesWon: profileData.games_won,
//           gamesLost: profileData.games_lost,
//           rankingPoints: profileData.ranking_points,
//           userRank: profileData.user_rank,
//           coins: profileData.coins,
//           exp: profileData.exp,
//           bestScore: profileData.best_score,
//           winRate: winRate, // Add the calculated win rate
//         }
//       };

//       return reply.send({
//         success: true,
//         user: userProfile
//       });

//     } catch (error) {
//       console.error('Error in getUserProfileById:', error);
//       return reply.code(500).send({
//         success: false,
//         error: 'Internal Server Error'
//       });
//     }
// }

static async getUserProfileById(request, reply) {
    try {
      const profileId = request.params.id;
      const currentUserId = request.user?.id;

      const profileData = await User.findProfileById(profileId, currentUserId);

      if (!profileData) {
        return reply.code(404).send({ success: false, error: 'User not found' });
      }

      let winRate = 0;
      if (profileData.games_played > 0) {
        winRate = (profileData.games_won / profileData.games_played) * 100;
      }
      
      const userProfile = {
        id: profileData.id,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        username: profileData.username,
        coalition: profileData.coalition,
        avatar: profileData.avatar,
        createdAt: profileData.created_at,
        is_friend: !!profileData.is_friend,
        pending_flag: !!profileData.pending_flag,
        sent_flag: !!profileData.sent_flag,
        stats: {
          gamesPlayed: profileData.games_played,
          gamesWon: profileData.games_won,
          gamesLost: profileData.games_lost,
          rankingPoints: profileData.ranking_points,
          userRank: profileData.user_rank,
          coins: profileData.coins,
          exp: profileData.exp,
          bestScore: profileData.best_score,
          winRate: winRate,
        }
      };

      return reply.send({
        success: true,
        user: userProfile
      });

    } catch (error) {
      console.error('Error in getUserProfileById:', error);
      return reply.code(500).send({
        success: false,
        error: 'Internal Server Error'
      });
    }
  }

  
}
module.exports = UserController;