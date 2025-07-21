const User = require('../models/User');

// Authentication middleware
const authenticate = async (request, reply) => {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return reply.code(401).send({ success: false, error: 'No token provided' });
    }
    
    console.log("===========AUTH==========");
    console.log("Token received:", token);
    
    const decoded = request.server.jwt.verify(token);
    console.log("Decoded token:", decoded);
    
    const user = await User.findById(decoded.userId);
    
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

module.exports = { authenticate };