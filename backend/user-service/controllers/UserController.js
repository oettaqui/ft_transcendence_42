const User = require('../models/User');
const UserStats = require('../models/UserStats');
const webSocketService = require('../services/WebSocketService');

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

static async getNotifications(request, reply) {
  console.log("============ getNotifications process begin ==========");
  try {
    const userId = request.user.id;
    const { unread_only, limit, offset } = request.query;

    let notifications;
    
    if (unread_only === 'true') {
      notifications = await User.getUnreadNotifications(userId);
    } else {
      notifications = await User.getNotifications(userId);
    }

    // Apply limit and offset if provided
    if (limit || offset) {
      const startIndex = parseInt(offset) || 0;
      const endIndex = limit ? startIndex + parseInt(limit) : undefined;
      notifications = notifications.slice(startIndex, endIndex);
    }

    // Get unread count
    const unreadCount = await User.getUnreadNotificationCount(userId);

    // Format notifications with friend avatars
    const formattedNotifications = await Promise.all(
      notifications.map(async (notification) => {
        let friendAvatar = null;
        
        try {
          const friend = await User.findById(notification.friend_id);
          friendAvatar = friend ? friend.avatar : null;
        } catch (error) {
          console.warn(`Failed to get avatar for friend ${notification.friend_id}:`, error);
        }

        return {
          id: notification.id,
          userId: notification.user_id,
          friendId: notification.friend_id,
          friendId_avatar: friendAvatar,
          message: notification.message,
          type: notification.type,
          isRead: Boolean(notification.is_read),
          readAt: notification.read_at,
          createdAt: notification.created_at,
          updatedAt: notification.updated_at
        };
      })
    );

    console.log(`✅ Retrieved ${notifications.length} notifications for user ${userId}`);
    
    return {
      success: true,
      data: {
        notifications: formattedNotifications,
        unreadCount: unreadCount,
        total: formattedNotifications.length
      }
    };
  } catch (error) {
    console.error('Get notifications error:', error);
    return reply.code(500).send({
      success: false,
      error: 'Failed to get notifications'
    });
  }
}

  static async addNotification(request, reply) {
    console.log("============ addNotification process begin ==========");
    try {
      const { user_id, message ,friend_id,type} = request.body;
      
      // Validation
      if (!user_id || !message) {
        return reply.code(400).send({
          success: false,
          error: 'user_id and message are required'
        });
      }

      if (typeof message !== 'string' || message.trim().length === 0) {
        return reply.code(400).send({
          success: false,
          error: 'Message must be a non-empty string'
        });
      }

      // Verify target user exists
      const targetUser = await User.findById(user_id);
      if (!targetUser) {
        return reply.code(404).send({
          success: false,
          error: 'Target user not found'
        });
      }

      // Create notification using User model
      const notification = await User.createNotification(user_id, message.trim(),friend_id,type);

      const formattedNotification = {
        id: notification.id,
        userId: notification.user_id,
        friendId: notification.friend_id,
        message: notification.message,
        type: notification.type,
        isRead: Boolean(notification.is_read),
        readAt: notification.read_at,
        createdAt: notification.created_at,
        updatedAt: notification.updated_at
      };

      console.log(`✅ Created notification for user ${user_id}: "${message}"`);
      await webSocketService.notifyNotifCreated(request.user.id);
      return reply.code(201).send({
        success: true,
        data: {
          notification: formattedNotification
        },
        message: 'Notification created successfully'
      });
    } catch (error) {
      console.error('Add notification error:', error);
      return reply.code(500).send({ 
        success: false, 
        error: 'Failed to create notification' 
      });
    }
  }

  // Additional helper methods

  static async markNotificationAsRead(request, reply) {
    console.log("============ markNotificationAsRead process begin ==========");
    try {
      const userId = request.user.id;
      const { id } = request.params;

      const success = await User.markNotificationAsRead(id, userId);
      
      if (!success) {
        return reply.code(404).send({
          success: false,
          error: 'Notification not found'
        });
      }

      console.log(`✅ Marked notification ${id} as read for user ${userId}`);
      
      return {
        success: true,
        message: 'Notification marked as read'
      };
    } catch (error) {
      console.error('Mark notification as read error:', error);
      return reply.code(500).send({ 
        success: false, 
        error: 'Failed to mark notification as read' 
      });
    }
  }

  static async markAllNotificationsAsRead(request, reply) {
    console.log("============ markAllNotificationsAsRead process begin ==========");
    try {
      const userId = request.user.id;

      const updatedCount = await User.markAllNotificationsAsRead(userId);

      console.log(`✅ Marked ${updatedCount} notifications as read for user ${userId}`);
      
      return {
        success: true,
        data: {
          updatedCount: updatedCount
        },
        message: 'All notifications marked as read'
      };
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      return reply.code(500).send({ 
        success: false, 
        error: 'Failed to mark all notifications as read' 
      });
    }
  }

  static async deleteNotification(request, reply) {
    console.log("============ deleteNotification process begin ==========");
    try {
      const userId = request.user.id;
      const { id } = request.params;

      const success = await User.deleteNotification(id, userId);
      
      if (!success) {
        return reply.code(404).send({
          success: false,
          error: 'Notification not found'
        });
      }

      console.log(`✅ Deleted notification ${id} for user ${userId}`);
      
      return {
        success: true,
        message: 'Notification deleted successfully'
      };
    } catch (error) {
      console.error('Delete notification error:', error);
      return reply.code(500).send({ 
        success: false, 
        error: 'Failed to delete notification' 
      });
    }
  }
}

module.exports = UserController;