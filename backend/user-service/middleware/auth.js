const User = require('../models/User');

// Authentication middleware for protecting routes
async function authenticate(request, reply) {
  try {
    // Verify JWT token
    await request.jwtVerify();
    
    // Get user from database to ensure they still exist and get fresh data
    console.log("===========AUTH==========");
    const user = await User.findById(request.user.userId);
    if (!user) {
      return reply.code(401).send({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    // Attach user to request object
    request.user = user;
    console.log("User authenticated:", user.username);
    console.log("==========================");
  } catch (err) {
    return reply.code(401).send({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
}

// Validation middleware
class ValidationMiddleware {
  static async validateRegistration(request, reply) {
    const { email, password, username} = request.body;
    
    if (!email || !password || !username) {
      return reply.code(400).send({
        success: false,
        error: 'Email, password, and username are required'
      });
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return reply.code(400).send({
        success: false,
        error: 'Invalid email format'
      });
    }
    
    // Password validation
    if (password.length < 8) {
      return reply.code(400).send({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }
    
    // Username validation
    if (username.length < 3 || username.length > 20) {
      return reply.code(400).send({
        success: false,
        error: 'Username must be between 3 and 20 characters'
      });
    }
    
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return reply.code(400).send({
        success: false,
        error: 'Username can only contain letters, numbers, and underscores'
      });
    }
  }
  
  static async validateLogin(request, reply) {
    const { email, password } = request.body;
    
    if (!email || !password) {
      return reply.code(400).send({
        success: false,
        error: 'Email and password are required'
      });
    }
  }
  
  static async validateProfileUpdate(request, reply) {
    const { firstName, lastName, avatar } = request.body;
    
    if (firstName && (firstName.length < 1 || firstName.length > 50)) {
      return reply.code(400).send({
        success: false,
        error: 'First name must be between 1 and 50 characters'
      });
    }
    
    if (lastName && (lastName.length < 1 || lastName.length > 50)) {
      return reply.code(400).send({
        success: false,
        error: 'Last name must be between 1 and 50 characters'
      });
    }
    
    if (avatar && typeof avatar !== 'string') {
      return reply.code(400).send({
        success: false,
        error: 'Avatar must be a valid URL string'
      });
    }
  }
  
  static async validateSearch(request, reply) {
    const { q: query } = request.query;
    
    if (!query || query.length < 2) {
      return reply.code(400).send({
        success: false,
        error: 'Search query must be at least 2 characters long'
      });
    }
  }
  
  static async validateFriendRequest(request, reply) {
    const { friendId } = request.body;
    
    if (!friendId || !Number.isInteger(friendId)) {
      return reply.code(400).send({
        success: false,
        error: 'Valid friend ID is required'
      });
    }
    
    if (friendId === request.user.id) {
      return reply.code(400).send({
        success: false,
        error: 'Cannot send friend request to yourself'
      });
    }
  }
}

module.exports = {
  authenticate,
  ValidationMiddleware
};