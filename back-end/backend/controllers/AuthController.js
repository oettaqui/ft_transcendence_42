const User = require('../models/User');
const UserStats = require('../models/UserStats');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client('394069384301-1b8bqmnv35qkfgk9icofqc5gthofupvk.apps.googleusercontent.com');

class AuthController {
  // Register new user
  static async register(request, reply) {
    const { email, password, username, firstName, lastName } = request.body;
    
    // Validation
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
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return reply.code(400).send({ 
          success: false, 
          error: 'User with this email already exists' 
        });
      }
      
      // Hash password
      const hashedPassword = await User.hashPassword(password);
      
      // Create user
      const userId = await User.create({
        username, 
        email, 
        password: hashedPassword, 
        firstName, 
        lastName
      });
      
      // Generate JWT token
      const token = request.server.jwt.sign(
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
      return reply.code(500).send({ success: false, error: 'Registration failed' });
    }
  }

  // Login user
  static async login(request, reply) {
    const { email, password } = request.body;
    
    if (!email || !password) {
      return reply.code(400).send({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }
    
    try {
      // Get user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return reply.code(401).send({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }
      
      // Verify password
      const isValidPassword = await user.verifyPassword(password);
      if (!isValidPassword) {
        return reply.code(401).send({ 
          success: false, 
          error: 'Invalid email or password' 
        });
      }
      
      // Update online status
      await user.updateOnlineStatus(true);
      
      // Generate JWT token
      const token = request.server.jwt.sign(
        { userId: user.id, email: user.email, username: user.username }, 
        { expiresIn: '7d' }
      );
      
      return {
        success: true,
        data: {
          user: user.toJSON(),
          token
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return reply.code(500).send({ success: false, error: 'Login failed' });
    }
  }

  // Google OAuth login
  static async googleVerify(request, reply) {
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
      let user = await User.findByGoogleId(googleId);
      
      if (!user) {
        // Then check by email
        user = await User.findByEmail(email);
        
        if (user && !user.googleId) {
          // Link existing account with Google - need to implement this method
          // For now, we'll create a new user or handle this case
          console.log('Linking existing account with Google auth');
        } else if (!user) {
          // Create new user with Google auth
          const username = email.split('@')[0];
          const firstName = name?.split(' ')[0] || username;
          const lastName = name?.split(' ')[1] || '';
          
          const userId = await User.create({
            username,
            email,
            password: null,
            firstName,
            lastName,
            googleId,
            avatar: picture
          });
          
          user = await User.findById(userId);
        }
      }
      
      // Update online status
      await user.updateOnlineStatus(true);
      
      // Generate JWT token
      const jwtToken = request.server.jwt.sign(
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
          user: user.toJSON()
        }
      };
    } catch (error) {
      console.error('Google verification error:', error);
      return reply.code(401).send({ 
        success: false, 
        error: 'Invalid Google token',
        details: error.message 
      });
    }
  }

  // Get current user info
  static async getCurrentUser(request, reply) {
    try {
      const user = request.user;
      const userStats = await UserStats.findByUserId(user.id);
      
      return {
        success: true,
        data: { 
          user: {
            ...user.toJSON(),
            stats: userStats.toJSON()
          }
        }
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to get user data' });
    }
  }

  // Update user profile
  static async updateProfile(request, reply) {
    const { firstName, lastName, avatar } = request.body;
    
    try {
      const changes = await request.user.updateProfile({ firstName, lastName, avatar });
      
      if (changes === 0) {
        return reply.code(404).send({ success: false, error: 'User not found' });
      }
      
      return { 
        success: true, 
        data: { 
          message: 'Profile updated successfully',
          user: request.user.toJSON()
        }
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to update profile' });
    }
  }

  // Change password
  static async changePassword(request, reply) {
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
      const isValidPassword = await request.user.verifyPassword(currentPassword);
      if (!isValidPassword) {
        return reply.code(401).send({ 
          success: false, 
          error: 'Current password is incorrect' 
        });
      }
      
      // Hash new password
      const hashedNewPassword = await User.hashPassword(newPassword);
      
      // Update password in database
      const changes = await request.user.updatePassword(hashedNewPassword);
      
      if (changes === 0) {
        return reply.code(404).send({ success: false, error: 'User not found' });
      }
      
      return { 
        success: true, 
        data: { message: 'Password updated successfully' }
      };
    } catch (error) {
      console.error('Change password error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to change password' });
    }
  }

  // Logout user
  static async logout(request, reply) {
    try {
      // Update online status to false
      await request.user.updateOnlineStatus(false);
      
      console.log(`User ${request.user.username} logged out`);
      return { 
        success: true, 
        data: { message: 'Logged out successfully' }
      };
    } catch (error) {
      console.error('Logout error:', error);
      return reply.code(500).send({ success: false, error: 'Logout failed' });
    }
  }

  // Get user stats
  static async getStats(request, reply) {
    try {
      const stats = await UserStats.findByUserId(request.user.id);
      return { 
        success: true, 
        data: { stats: stats.toJSON() }
      };
    } catch (error) {
      console.error('Get stats error:', error);
      return reply.code(500).send({ success: false, error: 'Failed to get user stats' });
    }
  }
}

module.exports = AuthController;