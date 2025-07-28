const User = require('../models/User');
const Friendship = require('../models/Friendship');

class FriendsController {
  // Search users to add as friends
  static async searchUsers(request, reply) {
    console.log("============ searchUsers procces begin ==========");
    const { q: query, limit = 10 } = request.query;
    
    if (!query || query.length < 2) {
      return reply.code(400).send({ 
        success: false, 
        error: 'Search query must be at least 2 characters long' 
      });
    }
    
    try {
      const users = await User.search(query, request.user.id, parseInt(limit));
      
      // Format users and remove sensitive data
      const formattedUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        isOnline: user.isOnline,
        lastLogin: user.lastLogin
      }));
      
      return { 
        success: true, 
        data: { users: formattedUsers }
      };
    } catch (error) {
      console.error('Search users error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to search users' });
    }
  }

  // Send friend request
  static async sendFriendRequest(request, reply) {
    console.log("============ sendFriendRequest procces begin ==========");
    const { friendId } = request.body;
    
    if (!friendId) {
      return reply.code(400).send({ 
        success: false, 
        error: 'Friend ID is required' 
      });
    }
    
    if (friendId === request.user.id) {
      return reply.code(400).send({ 
        success: false, 
        error: 'Cannot send friend request to yourself' 
      });
    }
    
    try {
      // Check if friend exists
      const friendUser = await User.findById(friendId);
      if (!friendUser) {
        return reply.code(404).send({ 
          success: false, 
          error: 'User not found' 
        });
      }
      
      const requestId = await Friendship.sendRequest(request.user.id, friendId);
      console.log(`Friend request sent: ${request.user.username} -> ${friendUser.username}`);
      
      return { 
        success: true, 
        data: { 
          message: `Friend request sent to ${friendUser.username}`,
          requestId
        }
      };
    } catch (error) {
      console.error('Send friend request error:', error);
      if (error.message.includes('already exists')) {
        return reply.code(400).send({ success: false, error: error.message });
      }
      return reply.code(500).send({ success: false, error: 'Failed to send friend request' });
    }
  }

  // Accept friend request
  static async acceptFriendRequest(request, reply) {
    console.log("============ acceptFriendRequest procces begin ==========");

    const { friendId } = request.body;
    
    if (!friendId) {
      return reply.code(400).send({ 
        success: false, 
        error: 'Friend ID is required' 
      });
    }
    
    try {
      const changes = await Friendship.acceptRequest(request.user.id, friendId);
      const friendUser = await User.findById(friendId);
      
      console.log(`Friend request accepted: ${request.user.username} accepted ${friendUser.username}`);
      
      return { 
        success: true, 
        data: { 
          message: `You are now friends with ${friendUser.username}`,
          friend: {
            id: friendUser.id,
            username: friendUser.username,
            firstName: friendUser.firstName,
            lastName: friendUser.lastName,
            avatar: friendUser.avatar,
            isOnline: friendUser.isOnline
          }
        }
      };
    } catch (error) {
      console.error('Accept friend request error:', error);
      if (error.message.includes('No pending')) {
        return reply.code(404).send({ success: false, error: 'Friend request not found' });
      }
      return reply.code(500).send({ success: false, error: 'Failed to accept friend request' });
    }
  }

  // Decline friend request
  static async declineFriendRequest(request, reply) {
    console.log("============ declineFriendRequest procces begin ==========");
    const { friendId } = request.body;
    
    if (!friendId) {
      return reply.code(400).send({ 
        success: false, 
        error: 'Friend ID is required' 
      });
    }
    
    try {
      const changes = await Friendship.declineRequest(request.user.id, friendId);
      
      if (changes === 0) {
        return reply.code(404).send({ 
          success: false, 
          error: 'Friend request not found' 
        });
      }
      
      console.log(`Friend request declined: ${request.user.username} declined request`);
      
      return { 
        success: true, 
        data: { message: 'Friend request declined' }
      };
    } catch (error) {
      console.error('Decline friend request error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to decline friend request' });
    }
  }

  // Cancel sent friend request
  static async cancelFriendRequest(request, reply) {
    console.log("============ cancelFriendRequest procces begin ==========");
    const { friendId } = request.params;
    
    try {
      const friendUser = await User.findById(friendId);
      if (!friendUser) {
        return reply.code(404).send({ 
          success: false, 
          error: 'User not found' 
        });
      }
      
      const changes = await Friendship.cancelRequest(request.user.id, parseInt(friendId));
      
      if (changes === 0) {
        return reply.code(404).send({ 
          success: false, 
          error: 'Friend request not found or already processed' 
        });
      }
      
      console.log(`Friend request cancelled: ${request.user.username} cancelled request to ${friendUser.username}`);
      
      return { 
        success: true, 
        data: { message: `Friend request to ${friendUser.username} cancelled` }
      };
    } catch (error) {
      console.error('Cancel friend request error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to cancel friend request' });
    }
  }

  // Remove friend (unfriend)
  static async removeFriend(request, reply) {
    console.log("============ removeFriend procces begin ==========");
    const { friendId } = request.params;
    
    try {
      const friendUser = await User.findById(friendId);
      if (!friendUser) {
        return reply.code(404).send({ 
          success: false, 
          error: 'Friend not found' 
        });
      }
      
      const changes = await Friendship.remove(request.user.id, parseInt(friendId));
      
      if (changes === 0) {
        return reply.code(404).send({ 
          success: false, 
          error: 'Friendship not found' 
        });
      }
      
      console.log(`Friendship removed: ${request.user.username} unfriended ${friendUser.username}`);
      
      return { 
        success: true, 
        data: { message: `Removed ${friendUser.username} from friends` }
      };
    } catch (error) {
      console.error('Remove friend error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to remove friend' });
    }
  }

  // Get friends list
  static async getFriends(request, reply) {
    console.log("============ getFriends procces begin ==========");
    try {
      const friends = await Friendship.getUserFriends(request.user.id);
      const onlineCount = await Friendship.getOnlineFriendsCount(request.user.id);
      
      const formattedFriends = friends.map(friend => ({
        id: friend.id,
        username: friend.username,
        firstName: friend.first_name,
        lastName: friend.last_name,
        avatar: friend.avatar,
        isOnline: Boolean(friend.is_online),
        lastLogin: friend.last_login,
        friendsSince: friend.friends_since
      }));
      
      return { 
        success: true, 
        data: { 
          friends: formattedFriends,
          totalFriends: friends.length,
          onlineFriends: onlineCount
        }
      };
    } catch (error) {
      console.error('Get friends error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to get friends list' });
    }
  }

  // Get pending friend requests (received)
  static async getPendingRequests(request, reply) {
    console.log("============ getPendingRequests procces begin ==========");
    try {
      const requests = await Friendship.getPendingRequests(request.user.id);
      
      const formattedRequests = requests.map(request => ({
        id: request.id,
        username: request.username,
        firstName: request.first_name,
        lastName: request.last_name,
        avatar: request.avatar,
        requestDate: request.request_date
      }));
      
      return { 
        success: true, 
        data: { 
          requests: formattedRequests,
          count: requests.length
        }
      };
    } catch (error) {
      console.error('Get pending requests error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to get friend requests' });
    }
  }

  // Get sent friend requests
  static async getSentRequests(request, reply) {
    console.log("============ getSentRequests procces begin ==========");
    try {
      const requests = await Friendship.getSentRequests(request.user.id);
      
      const formattedRequests = requests.map(request => ({
        id: request.id,
        username: request.username,
        firstName: request.first_name,
        lastName: request.last_name,
        avatar: request.avatar,
        requestDate: request.request_date
      }));
      
      return { 
        success: true, 
        data: { 
          requests: formattedRequests,
          count: requests.length
        }
      };
    } catch (error) {
      console.error('Get sent requests error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to get sent requests' });
    }
  }

  // Get friendship status with specific user
  static async getFriendshipStatus(request, reply) {
    console.log("============ getFriendshipStatus procces begin ==========");
    const { friendId } = request.params;
    
    try {
      const status = await Friendship.getStatus(request.user.id, parseInt(friendId));
      
      return { 
        success: true, 
        data: { status }
      };
    } catch (error) {
      console.error('Get friendship status error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to get friendship status' });
    }
  }

  // Update online status
  static async updateOnlineStatus(request, reply) {
    console.log("============ updateOnlineStatus procces begin ==========");
    const { isOnline } = request.body;
    
    if (typeof isOnline !== 'boolean') {
      return reply.code(400).send({ 
        success: false, 
        error: 'isOnline must be a boolean value' 
      });
    }
    
    try {
      const changes = await request.user.updateOnlineStatus(isOnline);
      
      console.log(`User ${request.user.username} is now ${isOnline ? 'online' : 'offline'}`);
      
      return { 
        success: true, 
        data: { 
          message: `Status updated to ${isOnline ? 'online' : 'offline'}`,
          isOnline
        }
      };
    } catch (error) {
      console.error('Update online status error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to update online status' });
    }
  }
}

module.exports = FriendsController;