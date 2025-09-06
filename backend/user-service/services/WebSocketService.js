// services/WebSocketService.js
const axios = require('axios');

class WebSocketService {
  constructor(apiGatewayUrl = 'http://api-gateway:3000') {
    this.apiGatewayUrl = apiGatewayUrl;
    this.broadcastEndpoint = `${apiGatewayUrl}/api/ws/broadcast`;
  }

  async sendEvent(eventData) {
    try {
      const response = await axios.post(this.broadcastEndpoint, eventData, {
        timeout: 5000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(`📡 Event sent successfully:`, eventData.event.type);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to send WebSocket event:`, error.message);
      return null;
    }
  }
  async broadcastToUser(userId, eventType, data) {
    return await this.sendEvent({
      userId: userId,
      event: {
        type: eventType,
        data: data,
        timestamp: new Date().toISOString()
      }
    });
  }

  async broadcastToUsers(userIds, eventType, data) {
    return await this.sendEvent({
      userIds: userIds,
      event: {
        type: eventType,
        data: data,
        timestamp: new Date().toISOString()
      }
    });
  }

  async broadcastToAll(eventType, data) {
    return await this.sendEvent({
      broadcast: 'all',
      event: {
        type: eventType,
        data: data,
        timestamp: new Date().toISOString()
      }
    });
  }

  async notifyProfileUpdate(userId, updatedFields) {
    return await this.broadcastToUser(userId, 'profile_updated', {
      userId: userId,
      updatedFields: updatedFields,
      message: 'Your profile has been updated'
    });
  }

  async notifyPasswordupdate(userId) {
    return await this.broadcastToUser(userId, 'password_updated', {
      userId: userId,
      message: 'Your password has been updated'
    });
  }

  async notifyStatsUpdate(userId, newStats) {
    return await this.broadcastToUser(userId, 'stats_updated', {
      userId: userId,
      stats: newStats,
      message: 'Your stats have been updated'
    });
  }

  async notifyFriendRequest(fromUserId, toUserId, fromUserData) {
    return await this.broadcastToUser(toUserId, 'friend_request_received', {
      fromUserId: fromUserId,
      fromUser: fromUserData,
      message: `${fromUserData.username} sent you a friend request`
    });
  }

  async notifyFriendRequestAccepted(fromUserId, toUserId, toUserData) {
    return await this.broadcastToUser(fromUserId, 'friend_request_accepted', {
      toUserId: toUserId,
      toUser: toUserData,
      message: `${toUserData.username} accepted your friend request`
    });
  }

  async notifyFriendRequestRejected(fromUserId, toUserId, toUserData) {
    return await this.broadcastToUser(fromUserId, 'friend_request_rejected', {
      toUserId: toUserId,
      toUser: toUserData,
      message: `${toUserData.username} rejected your friend request`
    });
  }

  async notifyFriendStatusChange(userId, friendIds, status) {
    return await this.broadcastToUsers(friendIds, 'friend_status_changed', {
      userId: userId,
      status: status,
      timestamp: new Date().toISOString()
    });
  }

  async notifyFriendRemoved(userId, removedFriendId) {
    await this.broadcastToUser(userId, 'friend_removed', {
      removedFriendId: removedFriendId
    });
    
    await this.broadcastToUser(removedFriendId, 'friend_removed', {
      removedFriendId: userId
    });
  }

  async getUserFriends(userId) {
    // This should call your friendship model/service
    // Return array of friend user IDs
    // You'll implement this based on your Friendship model
    return [];
  }
}

const webSocketService = new WebSocketService();

module.exports = webSocketService;