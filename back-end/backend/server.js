// server.js - Ping Pong Game Authentication Server
const fastify = require('fastify')({ logger: true });
const { 
    initDatabase,
    createUser,
    getUserByEmail,
    getUserById,
    getUserByGoogleId,
    updateUserProfile,
    updateUserOnlineStatus,
    updateUserPassword,
    getUserStats,
    updateUserStats,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    cancelFriendRequest,
    getUserFriends,
    getPendingFriendRequests,
    getSentFriendRequests,
    searchUsers,
    getFriendshipStatus,
    getOnlineFriendsCount,
    closeDatabase
  } = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Add this to your imports at the top
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client('394069384301-1b8bqmnv35qkfgk9icofqc5gthofupvk.apps.googleusercontent.com');


// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'pingpong-secret-key-change-in-production';

// CORS configuration
fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Cross-Origin-Opener-Policy']
});
// Register JWT plugin
fastify.register(require('@fastify/jwt'), {
  secret: JWT_SECRET
});

// Authentication middleware
const authenticate = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return reply.code(401).send({ success: false, error: 'No token provided' });
    }
    console.log("===========AUTH==========");
    console.log("Token received:", token);
    
    
    const decoded = fastify.jwt.verify(token);
    console.log("Decoded token:", decoded);
    
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return reply.code(401).send({ success: false, error: 'Invalid token' });
    }
    
    request.user = user;
    console.log("User authenticated:", user.username);
    console.log("==========================");
  } catch (error) {
    console.error("Auth error:", error);
    return reply.code(401).send({ success: false, error: 'Invalid token' });
  }
};

// Initialize database on startup
fastify.ready().then(() => {
  initDatabase();
})
.catch(err => {
  console.error('Error during Fastify initialization:', err);
});

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return { status: 'OK', timestamp: new Date().toISOString() };
});
// **********************************************************************
// Add this route after your other auth routes
fastify.post('/api/auth/google/verify', async (request, reply) => {
  const { token } = request.body;
  
  if (!token) {
    return reply.code(400).send({ 
      success: false, 
      error: 'Google token is required' 
    });
  }
  
  try {
    // Verify the Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: '394069384301-1b8bqmnv35qkfgk9icofqc5gthofupvk.apps.googleusercontent.com'
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    
    if (!email) {
      return reply.code(400).send({ 
        success: false, 
        error: 'Email not provided by Google' 
      });
    }

    // Check if user exists in database by Google ID first
    let user = await getUserByGoogleId(googleId);
    
    if (!user) {
      // Then check by email
      user = await getUserByEmail(email);
      
      if (user && !user.google_id) {
        // Link existing account with Google
        await db.run(
          'UPDATE users SET google_id = ? WHERE id = ?',
          [googleId, user.id]
        );
        user = await getUserById(user.id);
      } else if (!user) {
        // Create new user with Google auth
        const username = email.split('@')[0];
        const firstName = name?.split(' ')[0] || username;
        const lastName = name?.split(' ')[1] || '';
        
        const userId = await createUser(
          username,
          email,
          null, // No password for Google users
          firstName,
          lastName,
          googleId,
          picture
        );
        
        user = await getUserById(userId);
      }
    }
    
    // Generate JWT token
    const jwtToken = fastify.jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        username: user.username 
      }, 
      { expiresIn: '7d' }
    );
    
    return {
      success: true,
      data: {
        token: jwtToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          avatar: user.avatar,
          isOnline: true,
          createdAt: user.created_at
        }
      }
    };
  } catch (error) {
    console.error('Google verification error:', error);
    reply.code(401).send({ 
      success: false, 
      error: 'Invalid Google token',
      details: error.message 
    });
  }
});
// *********************************************************


// Auth Routes
// Register
fastify.post('/api/auth/register', async (request, reply) => {
  const { email, password, username, firstName, lastName } = request.body;
  
  if (!email || !password || !username) {
    return reply.code(400).send({ 
      success: false, 
      error: 'Email, password, and username are required' 
    });
  }
  
  if (password.length < 8) {
    return reply.code(400).send({ 
      success: false, 
      error: 'Password must be at least 8 characters long' 
    });
  }
  
  if (username.length < 3) {
    return reply.code(400).send({ 
      success: false, 
      error: 'Username must be at least 3 characters long' 
    });
  }
  
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return reply.code(400).send({ 
        success: false, 
        error: 'User with this email already exists' 
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const userId = await createUser(username, email, hashedPassword, firstName, lastName);
    
    // Generate JWT token
    const token = fastify.jwt.sign(
      { userId, email, username }, 
      { expiresIn: '7d' }
    );
    
    return {
      success: true,
      data: {
        user: { 
          id: userId, 
          username, 
          email, 
          firstName, 
          lastName,
          isOnline: false,
          createdAt: new Date().toISOString()
        },
        token
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('username')) {
      return reply.code(400).send({ 
        success: false, 
        error: 'Username already taken' 
      });
    }
    reply.code(500).send({ success: false, error: 'Registration failed' });
  }
});

// Login
fastify.post('/api/auth/login', async (request, reply) => {
  const { email, password } = request.body;
  
  if (!email || !password) {
    return reply.code(400).send({ 
      success: false, 
      error: 'Email and password are required' 
    });
  }
  
  try {
    // Get user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return reply.code(401).send({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return reply.code(401).send({ 
        success: false, 
        error: 'Invalid email or password' 
      });
    }
    
    // Generate JWT token
    const token = fastify.jwt.sign(
      { userId: user.id, email: user.email, username: user.username }, 
      { expiresIn: '7d' }
    );
    
    return {
      success: true,
      data: {
        user: { 
          id: user.id, 
          username: user.username, 
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          avatar: user.avatar,
          isOnline: true,
          createdAt: user.created_at
        },
        token
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    reply.code(500).send({ success: false, error: 'Login failed' });
  }
});

// Get current user
fastify.get('/api/auth/me', { preHandler: authenticate }, async (request, reply) => {
  try {
    const { password, ...userWithoutPassword } = request.user;
    console.log("////////////////////////");
    console.log(request.user);
    console.log("////////////////////////");
    const userStats = await getUserStats(request.user.id);
    
    return {
      success: true,
      data: { 
        user: {
          id: userWithoutPassword.id,
          username: userWithoutPassword.username,
          email: userWithoutPassword.email,
          firstName: userWithoutPassword.first_name,
          lastName: userWithoutPassword.last_name,
          avatar: userWithoutPassword.avatar,
          isOnline: true,
          createdAt: userWithoutPassword.created_at,
          stats: userStats
        }
      }
    };
  } catch (error) {
    console.error('Get current user error:', error);
    reply.code(500).send({ success: false, error: 'Failed to get user data' });
  }
});

// Update user profile
fastify.put('/api/auth/profile', { preHandler: authenticate }, async (request, reply) => {
  const { firstName, lastName, avatar } = request.body;
  
  try {
    const changes = await updateUserProfile(request.user.id, firstName, lastName, avatar);
    
    if (changes === 0) {
      return reply.code(404).send({ success: false, error: 'User not found' });
    }
    
    return { 
      success: true, 
      data: { 
        message: 'Profile updated successfully',
        user: {
          id: request.user.id,
          username: request.user.username,
          email: request.user.email,
          firstName,
          lastName,
          avatar
        }
      }
    };
  } catch (error) {
    console.error('Update profile error:', error);
    reply.code(500).send({ success: false, error: 'Failed to update profile' });
  }
});

// Change password
fastify.put('/api/auth/password', { preHandler: authenticate }, async (request, reply) => {
  const { currentPassword, newPassword } = request.body;
  
  if (!currentPassword || !newPassword) {
    return reply.code(400).send({ 
      success: false, 
      error: 'Current password and new password are required' 
    });
  }
  
  if (newPassword.length < 8) {
    return reply.code(400).send({ 
      success: false, 
      error: 'New password must be at least 8 characters long' 
    });
  }
  
  try {
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, request.user.password);
    if (!isValidPassword) {
      return reply.code(401).send({ 
        success: false, 
        error: 'Current password is incorrect' 
      });
    }
    
    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password in database
    const changes = await updateUserPassword(request.user.id, hashedNewPassword);
    
    if (changes === 0) {
      return reply.code(404).send({ success: false, error: 'User not found' });
    }
    
    return { 
      success: true, 
      data: { message: 'Password updated successfully' }
    };
  } catch (error) {
    console.error('Change password error:', error);
    reply.code(500).send({ success: false, error: 'Failed to change password' });
  }
});

// Logout (client-side token removal, but we can log this)
fastify.post('/api/auth/logout', { preHandler: authenticate }, async (request, reply) => {
  console.log(`User ${request.user.username} logged out`);
  return { 
    success: true, 
    data: { message: 'Logged out successfully' }
  };
});

// Get user stats (for game statistics)
fastify.get('/api/auth/stats', { preHandler: authenticate }, async (request, reply) => {
  try {
    const stats = await getUserStats(request.user.id);
    return { 
      success: true, 
      data: { stats }
    };
  } catch (error) {
    console.error('Get stats error:', error);
    reply.code(500).send({ success: false, error: 'Failed to get user stats' });
  }
});

// Add these endpoints to your server.js file
// Import the new functions at the top with your other imports


// Friend System Routes

// Search users to add as friends
fastify.get('/api/friends/search', { preHandler: authenticate }, async (request, reply) => {
    const { q: query, limit = 10 } = request.query;
    
    if (!query || query.length < 2) {
        return reply.code(400).send({ 
            success: false, 
            error: 'Search query must be at least 2 characters long' 
        });
    }
    
    try {
        const users = await searchUsers(query, request.user.id, parseInt(limit));
        return { 
            success: true, 
            data: { users }
        };
    } catch (error) {
        console.error('Search users error:', error);
        reply.code(500).send({ success: false, error: 'Failed to search users' });
    }
});

// Send friend request
fastify.post('/api/friends/request', { preHandler: authenticate }, async (request, reply) => {
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
        const friendUser = await getUserById(friendId);
        if (!friendUser) {
            return reply.code(404).send({ 
                success: false, 
                error: 'User not found' 
            });
      }
      
      const requestId = await sendFriendRequest(request.user.id, friendId);
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
        reply.code(500).send({ success: false, error: 'Failed to send friend request' });
    }
});

// Accept friend request
fastify.post('/api/friends/accept', { preHandler: authenticate }, async (request, reply) => {
    const { friendId } = request.body;
    
    if (!friendId) {
        return reply.code(400).send({ 
            success: false, 
            error: 'Friend ID is required' 
        });
    }
    
    try {
        const changes = await acceptFriendRequest(request.user.id, friendId);
        const friendUser = await getUserById(friendId);
        
        console.log(`Friend request accepted: ${request.user.username} accepted ${friendUser.username}`);
        
        return { 
            success: true, 
            data: { 
                message: `You are now friends with ${friendUser.username}`,
                friend: {
                    id: friendUser.id,
                    username: friendUser.username,
                    firstName: friendUser.first_name,
                    lastName: friendUser.last_name,
                    avatar: friendUser.avatar,
                    isOnline: friendUser.is_online
                }
            }
      };
    } catch (error) {
        console.error('Accept friend request error:', error);
        if (error.message.includes('No pending')) {
            return reply.code(404).send({ success: false, error: 'Friend request not found' });
        }
        reply.code(500).send({ success: false, error: 'Failed to accept friend request' });
    }
});

// Decline friend request
fastify.post('/api/friends/decline', { preHandler: authenticate }, async (request, reply) => {
    const { friendId } = request.body;
    
    if (!friendId) {
        return reply.code(400).send({ 
            success: false, 
            error: 'Friend ID is required' 
        });
    }
    
    try {
        const changes = await declineFriendRequest(request.user.id, friendId);
        
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
        reply.code(500).send({ success: false, error: 'Failed to decline friend request' });
    }
});

// Remove friend (unfriend)
fastify.delete('/api/friends/:friendId', { preHandler: authenticate }, async (request, reply) => {
    const { friendId } = request.params;
    
    try {
        const friendUser = await getUserById(friendId);
        if (!friendUser) {
            return reply.code(404).send({ 
                success: false, 
                error: 'Friend not found' 
            });
        }
        
        const changes = await removeFriend(request.user.id, parseInt(friendId));
        
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
        reply.code(500).send({ success: false, error: 'Failed to remove friend' });
    }
});

// Get friends list
fastify.get('/api/friends', { preHandler: authenticate }, async (request, reply) => {
    try {
        const friends = await getUserFriends(request.user.id);
        const onlineCount = await getOnlineFriendsCount(request.user.id);
        
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
        reply.code(500).send({ success: false, error: 'Failed to get friends list' });
    }
});

// Get pending friend requests (received)
fastify.get('/api/friends/requests/pending', { preHandler: authenticate }, async (request, reply) => {
    try {
        const requests = await getPendingFriendRequests(request.user.id);
        
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
        reply.code(500).send({ success: false, error: 'Failed to get friend requests' });
    }
});

  // Get sent friend requests
  fastify.get('/api/friends/requests/sent', { preHandler: authenticate }, async (request, reply) => {
      try {
          const requests = await getSentFriendRequests(request.user.id);
          
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
            reply.code(500).send({ success: false, error: 'Failed to get sent requests' });
        }
    });
    
    // Get friendship status with specific user
    fastify.get('/api/friends/status/:friendId', { preHandler: authenticate }, async (request, reply) => {
        const { friendId } = request.params;
        
        try {
            const status = await getFriendshipStatus(request.user.id, parseInt(friendId));
            
            return { 
                success: true, 
                data: { status }
            };
        } catch (error) {
            console.error('Get friendship status error:', error);
            reply.code(500).send({ success: false, error: 'Failed to get friendship status' });
        }
    });
    
    // Update online status (you can call this when user logs in/out)
    fastify.put('/api/friends/status/online', { preHandler: authenticate }, async (request, reply) => {
        const { isOnline } = request.body;
        
        if (typeof isOnline !== 'boolean') {
            return reply.code(400).send({ 
                success: false, 
                error: 'isOnline must be a boolean value' 
            });
        }
        
        try {
            const changes = await updateUserOnlineStatus(request.user.id, isOnline);
            
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
            reply.code(500).send({ success: false, error: 'Failed to update online status' });
        }
    });
    
    fastify.delete('/api/friends/request/:friendId', { preHandler: authenticate }, async (request, reply) => {
      const { friendId } = request.params;
      
      try {
          const friendUser = await getUserById(friendId);
          if (!friendUser) {
              return reply.code(404).send({ 
                  success: false, 
                  error: 'User not found' 
              });
          }
          
          const changes = await cancelFriendRequest(request.user.id, parseInt(friendId));
          
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
          reply.code(500).send({ success: false, error: 'Failed to cancel friend request' });
      }
  });
// Start the server
const start = async () => {
    try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🏓 Ping Pong Game Authentication Server is running on http://localhost:3000');
    console.log('📊 Health check available at: http://localhost:3000/health');
    } catch (err) {
    fastify.log.error(err);
    process.exit(1);
    }
};

start();