const User = require('../models/User');
const UserStats = require('../models/UserStats');
const { OAuth2Client } = require('google-auth-library');
// Add this import at the top of AuthController.js (after other requires)
const EmailService = require('../services/EmailService');

const googleClient = new OAuth2Client('394069384301-1b8bqmnv35qkfgk9icofqc5gthofupvk.apps.googleusercontent.com');

class AuthController {
  // Register new user
  static async register(request, reply) {
    const { email, password, username} = request.body;
    
    console.log("============ register process begin ==========");
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
        password: hashedPassword
      });
      
      // Send email verification
      try {
        const verificationToken = await User.createEmailVerificationToken(userId);
        await EmailService.sendEmailVerification(email, username, verificationToken);
        console.log(`📧 Verification email sent to ${email}`);
      } catch (emailError) {
        console.error('Failed to send verification email:', emailError);
        // Don't fail registration if email fails
      }
      
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
            emailVerified: false,
            isOnline: false,
            createdAt: new Date().toISOString()
          },
          token
        },
        message: 'Registration successful! Please check your email to verify your account.'
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

  // Login user (with 2FA support)
  static async login(request, reply) {
    const { email, password, twoFactorCode } = request.body;
    
    console.log("============ login process begin ==========");
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
      
      // Check if 2FA is enabled
      if (user.twoFactorEnabled && user.twoFactorMethod === 'email') {
        
        if (!twoFactorCode) {
          // First step: Send 2FA code
          const code = await User.create2FACode(user.id, 'login');
          await EmailService.send2FACode(user.email, user.username, code);
          
          return {
            success: false,
            requiresTwoFactor: true,
            message: 'Please check your email for the verification code',
            data: {
              userId: user.id,
              email: user.email
            }
          };
        } else {
          // Second step: Verify 2FA code
          const isValidCode = await User.verify2FACode(user.id, twoFactorCode, 'login');
          if (!isValidCode) {
            return reply.code(401).send({
              success: false,
              error: 'Invalid or expired verification code'
            });
          }
        }
      }
      
      // Update online status
      await user.updateOnlineStatus(true);
      
      // Generate JWT token
      const token = request.server.jwt.sign(
        { userId: user.id, email: user.email, username: user.username }, 
        { expiresIn: '7d' }
      );
      
      console.log(`✅ User ${user.username} logged in successfully`);
      
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

  // Verify email
  static async verifyEmail(request, reply) {
    const { token } = request.params;
    
    console.log("============ verifyEmail process begin ==========");
    
    try {
      const user = await User.verifyEmailToken(token);
      
      if (!user) {
        return reply.code(400).send({
          success: false,
          error: 'Invalid or expired verification token'
        });
      }
      
      // Mark email as verified
      await user.verifyEmail();
      
      console.log(`✅ Email verified for user: ${user.username}`);
      
      return {
        success: true,
        message: 'Email verified successfully! You can now enable two-factor authentication.',
        data: {
          emailVerified: true,
          user: user.toJSON()
        }
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return reply.code(500).send({ 
        success: false, 
        error: 'Email verification failed' 
      });
    }
  }

  // Enable 2FA
  static async enable2FA(request, reply) {
    const user = request.user;
    const { method = 'email' } = request.body;
    
    console.log("============ enable2FA process begin ==========");
    
    if (!user.emailVerified) {
      return reply.code(400).send({
        success: false,
        error: 'Please verify your email address before enabling 2FA'
      });
    }
    
    if (user.twoFactorEnabled) {
      return reply.code(400).send({
        success: false,
        error: '2FA is already enabled'
      });
    }
    
    try {
      // Generate backup codes
      const backupCodes = User.generateBackupCodes();
      
      // Enable 2FA
      await user.enable2FA(method, backupCodes);
      
      // Send confirmation email
      await EmailService.send2FAEnabledNotification(user.email, user.username, backupCodes);
      
      console.log(`✅ 2FA enabled for user: ${user.username}`);
      
      return {
        success: true,
        message: '2FA enabled successfully!',
        data: {
          backupCodes: backupCodes,
          twoFactorEnabled: true,
          method: method
        }
      };
    } catch (error) {
      console.error('Enable 2FA error:', error);
      return reply.code(500).send({ 
        success: false, 
        error: 'Failed to enable 2FA' 
      });
    }
  }

  // Disable 2FA
  static async disable2FA(request, reply) {
    const user = request.user;
    const { password, backupCode } = request.body;
    
    console.log("============ disable2FA process begin ==========");
    
    if (!user.twoFactorEnabled) {
      return reply.code(400).send({
        success: false,
        error: '2FA is not enabled'
      });
    }
    
    try {
      let verified = false;
      
      // Verify with password or backup code
      if (password) {
        verified = await user.verifyPassword(password);
      } else if (backupCode) {
        verified = await user.verifyBackupCode(backupCode);
      }
      
      if (!verified) {
        return reply.code(401).send({
          success: false,
          error: 'Invalid password or backup code'
        });
      }
      
      // Disable 2FA
      await user.disable2FA();
      
      // Send notification email
      await EmailService.send2FADisabledNotification(user.email, user.username);
      
      console.log(`✅ 2FA disabled for user: ${user.username}`);
      
      return {
        success: true,
        message: '2FA disabled successfully',
        data: {
          twoFactorEnabled: false
        }
      };
    } catch (error) {
      console.error('Disable 2FA error:', error);
      return reply.code(500).send({ 
        success: false, 
        error: 'Failed to disable 2FA' 
      });
    }
  }

  // Get 2FA status
  static async get2FAStatus(request, reply) {
    const user = request.user;
    
    console.log("============ get2FAStatus process begin ==========");
    
    return {
      success: true,
      data: user.get2FAStatus()
    };
  }

  // Generate new backup codes
  static async generateNewBackupCodes(request, reply) {
    const user = request.user;
    const { password } = request.body;
    
    console.log("============ generateNewBackupCodes process begin ==========");
    
    if (!user.twoFactorEnabled) {
      return reply.code(400).send({
        success: false,
        error: '2FA is not enabled'
      });
    }
    
    try {
      // Verify password
      const isValidPassword = await user.verifyPassword(password);
      if (!isValidPassword) {
        return reply.code(401).send({
          success: false,
          error: 'Invalid password'
        });
      }
      
      // Generate new backup codes
      const newBackupCodes = User.generateBackupCodes();
      await user.enable2FA(user.twoFactorMethod, newBackupCodes);
      
      console.log(`✅ New backup codes generated for user: ${user.username}`);
      
      return {
        success: true,
        message: 'New backup codes generated successfully',
        data: {
          backupCodes: newBackupCodes
        }
      };
    } catch (error) {
      console.error('Generate backup codes error:', error);
      return reply.code(500).send({ 
        success: false, 
        error: 'Failed to generate new backup codes' 
      });
    }
  }

  // Google OAuth login (existing method - no changes needed)
  static async googleVerify(request, reply) {
    const { token } = request.body;
    
    console.log("============ googleVerify process begin ==========");
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

  // Get current user info (existing method - updated to include 2FA status)
  static async getCurrentUser(request, reply) {
    console.log("============ getCurrentUser process begin ==========");
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

  // Update user profile (existing method - no changes)
  static async updateProfile(request, reply) {
    const { firstName, lastName, avatar } = request.body;
    console.log("============ updateProfile process begin ==========");
    
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

  // Change password (existing method - no changes)
  static async changePassword(request, reply) {
    const { currentPassword, newPassword } = request.body;
    console.log("============ changePassword process begin ==========");

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

  // Logout user (existing method - no changes)
  static async logout(request, reply) {
    console.log("============ logout process begin ==========");

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

  // Get user stats (existing method - no changes)
  static async getStats(request, reply) {
    console.log("============ getStats process begin ==========");
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

    // Resend email verification
    static async resendVerificationEmail(request, reply) {
      const user = request.user;
      
      console.log("============ resendVerificationEmail process begin ==========");
      
      if (user.emailVerified) {
        return reply.code(400).send({
          success: false,
          error: 'Email is already verified'
        });
      }
      
      try {
        // Generate new verification token
        const token = await user.resendEmailVerification();
        
        // Send verification email
        const EmailService = require('../services/EmailService');
        await EmailService.sendEmailVerification(user.email, user.username, token);
        
        console.log(`📧 Verification email resent to ${user.email}`);
        
        return {
          success: true,
          message: 'Verification email sent! Please check your inbox.',
          data: {
            email: user.email
          }
        };
      } catch (error) {
        console.error('Resend verification email error:', error);
        return reply.code(500).send({ 
          success: false, 
          error: 'Failed to send verification email' 
        });
      }
    }
    // Add this method to your AuthController.js class
static async resendVerificationEmailPublic(request, reply) {
  const { email } = request.body;
  
  console.log("============ resendVerificationEmailPublic process begin ==========");
  
  if (!email) {
    return reply.code(400).send({
      success: false,
      error: 'Email is required'
    });
  }
  
  try {
    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      return {
        success: true,
        message: 'If this email exists and is not verified, a verification email has been sent.'
      };
    }
    
    if (user.emailVerified) {
      return reply.code(400).send({
        success: false,
        error: 'Email is already verified'
      });
    }
    
    // Generate new verification token
    const token = await User.createEmailVerificationToken(user.id);
    
    // Send verification email
    const EmailService = require('../services/EmailService');
    await EmailService.sendEmailVerification(user.email, user.username, token);
    
    console.log(`📧 Verification email resent to ${user.email}`);
    
    return {
      success: true,
      message: 'Verification email sent! Please check your inbox.',
      data: {
        email: user.email
      }
    };
  } catch (error) {
    console.error('Resend verification email error:', error);
    return reply.code(500).send({ 
      success: false, 
      error: 'Failed to send verification email' 
    });
  }
}
}

module.exports = AuthController;