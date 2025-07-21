
class ValidationMiddleware {
    // Validate registration data
    static validateRegistration(request, reply, done) {
      const { email, password, username, firstName, lastName } = request.body;
      const errors = [];
  
      // Email validation
      if (!email) {
        errors.push('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format');
      }
  
      // Password validation
      if (!password) {
        errors.push('Password is required');
      } else if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      }
  
      // Username validation
      if (!username) {
        errors.push('Username is required');
      } else if (username.length < 3) {
        errors.push('Username must be at least 3 characters long');
      } else if (username.length > 20) {
        errors.push('Username must be less than 20 characters');
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errors.push('Username can only contain letters, numbers, and underscores');
      }
  
      // Name validation (optional but if provided, should be valid)
      if (firstName && firstName.length > 50) {
        errors.push('First name must be less than 50 characters');
      }
      if (lastName && lastName.length > 50) {
        errors.push('Last name must be less than 50 characters');
      }
  
      if (errors.length > 0) {
        return reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: errors
        });
      }
  
      done();
    }
  
    // Validate login data
    static validateLogin(request, reply, done) {
      const { email, password } = request.body;
      const errors = [];
  
      if (!email) {
        errors.push('Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Invalid email format');
      }
  
      if (!password) {
        errors.push('Password is required');
      }
  
      if (errors.length > 0) {
        return reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: errors
        });
      }
  
      done();
    }
  
    // Validate friend request
    static validateFriendRequest(request, reply, done) {
      const { friendId } = request.body;
      const errors = [];
  
      if (!friendId) {
        errors.push('Friend ID is required');
      } else if (!Number.isInteger(Number(friendId)) || Number(friendId) <= 0) {
        errors.push('Friend ID must be a positive integer');
      }
  
      if (Number(friendId) === request.user?.id) {
        errors.push('Cannot send friend request to yourself');
      }
  
      if (errors.length > 0) {
        return reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: errors
        });
      }
  
      done();
    }
  
    // Validate profile update
    static validateProfileUpdate(request, reply, done) {
      const { firstName, lastName, avatar } = request.body;
      const errors = [];
  
      if (firstName && firstName.length > 50) {
        errors.push('First name must be less than 50 characters');
      }
      if (lastName && lastName.length > 50) {
        errors.push('Last name must be less than 50 characters');
      }
      if (avatar && avatar.length > 500) {
        errors.push('Avatar URL must be less than 500 characters');
      }
      if (avatar && !/^https?:\/\/.+/.test(avatar)) {
        errors.push('Avatar must be a valid URL');
      }
  
      if (errors.length > 0) {
        return reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: errors
        });
      }
  
      done();
    }
  
    // Validate search query
    static validateSearch(request, reply, done) {
      const { q: query, limit } = request.query;
      const errors = [];
  
      if (!query) {
        errors.push('Search query is required');
      } else if (query.length < 2) {
        errors.push('Search query must be at least 2 characters long');
      } else if (query.length > 50) {
        errors.push('Search query must be less than 50 characters');
      }
  
      if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 50)) {
        errors.push('Limit must be a number between 1 and 50');
      }
  
      if (errors.length > 0) {
        return reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: errors
        });
      }
  
      done();
    }
  
    // Validate game stats (for when you add game functionality)
    static validateGameStats(request, reply, done) {
      const { score, gameResult, gameMode } = request.body;
      const errors = [];
  
      if (score !== undefined && (!Number.isInteger(Number(score)) || Number(score) < 0)) {
        errors.push('Score must be a non-negative integer');
      }
  
      if (gameResult && !['win', 'loss', 'draw'].includes(gameResult)) {
        errors.push('Game result must be win, loss, or draw');
      }
  
      if (gameMode && !['single', 'multiplayer', 'tournament'].includes(gameMode)) {
        errors.push('Game mode must be single, multiplayer, or tournament');
      }
  
      if (errors.length > 0) {
        return reply.code(400).send({
          success: false,
          error: 'Validation failed',
          details: errors
        });
      }
  
      done();
    }
  }
  
  module.exports = ValidationMiddleware;