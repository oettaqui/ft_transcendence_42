// middleware/userStatus.js
const webSocketService = require('../services/WebSocketService');

// Track user activity and online status
const userActivityTracker = {
  activeUsers: new Map(), // userId -> last activity timestamp
  statusUpdateInterval: null,

  // Mark user as active
  updateActivity(userId) {
    this.activeUsers.set(userId, Date.now());
  },

  // Check for inactive users and mark them offline
  checkInactiveUsers() {
    const now = Date.now();
    const INACTIVE_THRESHOLD = 5 * 60 * 1000; // 5 minutes

    this.activeUsers.forEach(async (lastActivity, userId) => {
      if (now - lastActivity > INACTIVE_THRESHOLD) {
        console.log(`👻 User ${userId} marked as inactive`);
        this.activeUsers.delete(userId);
        
        // Get user's friends and notify them
        try {
          const friendIds = await this.getUserFriends(userId);
          await webSocketService.notifyFriendStatusChange(userId, friendIds, 'offline');
        } catch (error) {
          console.error('Error notifying friend status change:', error);
        }
      }
    });
  },

  // Start the status checker
  startStatusChecker() {
    if (this.statusUpdateInterval) return;
    
    this.statusUpdateInterval = setInterval(() => {
      this.checkInactiveUsers();
    }, 60000); // Check every minute

    console.log('📊 User status tracker started');
  },

  // Stop the status checker
  stopStatusChecker() {
    if (this.statusUpdateInterval) {
      clearInterval(this.statusUpdateInterval);
      this.statusUpdateInterval = null;
    }
  },

  // Get user friends - implement this based on your Friendship model
  async getUserFriends(userId) {
    // TODO: Implement this using your Friendship model
    // Should return array of friend user IDs
    try {
      const Friendship = require('../models/Friendship');
      // This is a placeholder - adjust based on your Friendship model structure
      const friendships = await Friendship.getUserFriends(userId);
      return friendships.map(f => f.friendId);
    } catch (error) {
      console.error('Error getting user friends:', error);
      return [];
    }
  }
};

// Middleware to track user activity on each request
const trackUserActivity = async (request, reply) => {
  // Only track if user is authenticated
  if (request.user && request.user.id) {
    userActivityTracker.updateActivity(request.user.id);
  }
};

// Middleware to handle user login (mark as online)
const handleUserLogin = async (userId, userData) => {
  console.log(`🟢 User ${userId} logged in`);
  userActivityTracker.updateActivity(userId);
  
  try {
    // Get user's friends and notify them
    const friendIds = await userActivityTracker.getUserFriends(userId);
    await webSocketService.notifyFriendStatusChange(userId, friendIds, 'online');
  } catch (error) {
    console.error('Error notifying login status:', error);
  }
};

// Middleware to handle user logout (mark as offline)
const handleUserLogout = async (userId) => {
  console.log(`🔴 User ${userId} logged out`);
  userActivityTracker.activeUsers.delete(userId);
  
  try {
    // Get user's friends and notify them
    const friendIds = await userActivityTracker.getUserFriends(userId);
    await webSocketService.notifyFriendStatusChange(userId, friendIds, 'offline');
  } catch (error) {
    console.error('Error notifying logout status:', error);
  }
};

module.exports = {
  userActivityTracker,
  trackUserActivity,
  handleUserLogin,
  handleUserLogout
};


// Active Internet connections (only servers)
// Proto Recv-Q Send-Q Local Address           Foreign Address         State      
// tcp        0      0 0.0.0.0:3001            0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:3000            0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:51619           0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:2049            0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:44857           0.0.0.0:*               LISTEN     
// tcp        0      0 127.0.0.1:6379          0.0.0.0:*               LISTEN     
// tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:41627           0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:57507           0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN     
// tcp        0      0 192.168.122.1:53        0.0.0.0:*               LISTEN     
// tcp        0      0 127.0.0.1:4242          0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:42209           0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:8080            0.0.0.0:*               LISTEN     
// tcp        0      0 0.0.0.0:5900            0.0.0.0:*               LISTEN     
// tcp        0      0 127.0.0.1:631           0.0.0.0:*               LISTEN     
// tcp        0      0 127.0.0.1:8828          0.0.0.0:*               LISTEN     
// tcp6       0      0 :::3001                 :::*                    LISTEN     
// tcp6       0      0 :::3000                 :::*                    LISTEN     
// tcp6       0      0 ::1:631                 :::*                    LISTEN     
// tcp6       0      0 :::2049                 :::*                    LISTEN     
// tcp6       0      0 :::9100                 :::*                    LISTEN     
// tcp6       0      0 :::41291                :::*                    LISTEN     
// tcp6       0      0 :::111                  :::*                    LISTEN     
// tcp6       0      0 :::34743                :::*                    LISTEN     
// tcp6       0      0 :::34099                :::*                    LISTEN     
// tcp6       0      0 :::8080                 :::*                    LISTEN     
// tcp6       0      0 :::48989                :::*                    LISTEN     
// tcp6       0      0 ::1:6379                :::*                    LISTEN     
// tcp6       0      0 :::36885                :::*                    LISTEN     
// tcp6       0      0 :::5900                 :::*                    LISTEN     
// udp        0      0 192.168.122.1:53        0.0.0.0:*                          
// udp        0      0 127.0.0.53:53           0.0.0.0:*                          
// udp        0      0 0.0.0.0:67              0.0.0.0:*                          
// udp        0      0 10.13.1.7:68            0.0.0.0:*                          
// udp        0      0 0.0.0.0:111             0.0.0.0:*                          
// udp        0      0 127.0.0.1:959           0.0.0.0:*                          
// udp        0      0 0.0.0.0:51348           0.0.0.0:*                          
// udp        0      0 0.0.0.0:35462           0.0.0.0:*                          
// udp        0      0 0.0.0.0:44266           0.0.0.0:*                          
// udp        0      0 0.0.0.0:44676           0.0.0.0:*                          
// udp        0      0 0.0.0.0:53433           0.0.0.0:*                          
// udp        0      0 0.0.0.0:53922           0.0.0.0:*                          
// udp        0      0 224.0.0.251:5353        0.0.0.0:*                          
// udp        0      0 224.0.0.251:5353        0.0.0.0:*                          
// udp        0      0 0.0.0.0:5353            0.0.0.0:*                          
// udp        0      0 0.0.0.0:39133           0.0.0.0:*                          
// udp        0      0 0.0.0.0:39754           0.0.0.0:*                          
// udp6       0      0 :::111                  :::*                               
// udp6       0      0 :::57669                :::*                               
// udp6       0      0 :::50396                :::*                               
// udp6       0      0 :::50733                :::*                               
// udp6       0      0 :::51349                :::*                               
// udp6       0      0 :::52684                :::*                               
// udp6       0      0 :::5353                 :::*                               
// udp6       0      0 :::39038                :::*                               
// udp6       0      0 :::47958                :::* 