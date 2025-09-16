const { db } = require('../config/database');

class Friendship {
  constructor(data = {}) {
    this.id = data.id;
    this.user1Id = data.user1_id || data.user1Id;
    this.user2Id = data.user2_id || data.user2Id;
    this.status = data.status;
    this.actionUserId = data.action_user_id || data.actionUserId;
    this.createdAt = data.created_at || data.createdAt;
    this.updatedAt = data.updated_at || data.updatedAt;
  }

  static async sendRequest(fromUserId, toUserId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM friendships 
         WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
        [fromUserId, toUserId, toUserId, fromUserId],
        (err, row) => {
          if (err) return reject(err);
          if (row) {
            return reject(new Error('Friendship or request already exists'));
          }
          
          db.get(
            `SELECT * FROM friend_requests 
             WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)`,
            [fromUserId, toUserId, toUserId, fromUserId],
            (err, row) => {
              if (err) return reject(err);
              if (row) {
                return reject(new Error('Friend request already exists'));
              }
              
              db.run(
                `INSERT INTO friend_requests 
                 (from_user_id, to_user_id, status, created_at) 
                 VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)`,
                [fromUserId, toUserId],
                function(err) {
                  if (err) return reject(err);
                  resolve(this.lastID);
                }
              );
            }
          );
        }
      );
    });
  }

  static async acceptRequest(userId, friendId) {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run(
          `UPDATE friend_requests 
           SET status = 'accepted', updated_at = CURRENT_TIMESTAMP 
           WHERE from_user_id = ? AND to_user_id = ? AND status = 'pending'`,
          [friendId, userId],
          function(err) {
            if (err) return reject(err);
            if (this.changes === 0) {
              return reject(new Error('No pending friend request found'));
            }
            
            db.run(
              `INSERT INTO friendships 
               (user1_id, user2_id, status, action_user_id) 
               VALUES (?, ?, 'accepted', ?)`,
              [userId, friendId, userId],
              function(err) {
                if (err) return reject(err);
                resolve(this.changes);
              }
            );
          }
        );
      });
    });
  }

  static async declineRequest(userId, friendId) {
    // return new Promise((resolve, reject) => {
    //   db.run(
    //     `DELETE FROM friend_requests 
    //     WHERE from_user_id = ? AND to_user_id = ? AND status = 'pending'`,
    //     [friendId, userId],
    //     function(err) {
    //       if (err) return reject(err);
    //       resolve(this.changes);
    //     }
    //   );
    // });
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM friend_requests 
        WHERE from_user_id = ? AND to_user_id = ? AND status = 'pending'`,
        [friendId, userId],
        function(err) {
          if (err) return reject(err);
          
          const friendRequestChanges = this.changes;
          
          db.run(
            `DELETE FROM notifications 
            WHERE user_id = ? AND friend_id = ? AND type = 'friend_request'`,
            [userId, friendId],
            function(err) {
              if (err) return reject(err);
              resolve({
                friendRequestsDeleted: friendRequestChanges,
                notificationsDeleted: this.changes
              });
            }
          );
        }
      );
    });
  }

static async cancelRequest(userId, friendId) {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM friend_requests 
       WHERE from_user_id = ? AND to_user_id = ? AND status = 'pending'`,
      [userId, friendId],
      function(err) {
        if (err) return reject(err);
        
        const friendRequestChanges = this.changes;
        
        db.run(
          `DELETE FROM notifications 
           WHERE user_id = ? AND friend_id = ? AND type = 'friend_request'`,
          [friendId, userId],
          function(err) {
            if (err) return reject(err);
            resolve({
              friendRequestsDeleted: friendRequestChanges,
              notificationsDeleted: this.changes
            });
          }
        );
      }
    );
  });
}

  static async remove(userId, friendId) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM friendships 
         WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
        [userId, friendId, friendId, userId],
        function(err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }

  static async getUserFriends(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT u.id, u.username, u.first_name, u.last_name, u.avatar, u.is_online, u.last_login, 
                f.created_at AS friends_since
         FROM users u
         JOIN friendships f ON (f.user1_id = u.id OR f.user2_id = u.id)
         WHERE (f.user1_id = ? OR f.user2_id = ?) AND u.id != ? AND f.status = 'accepted'
         ORDER BY u.is_online DESC, u.username ASC`,
        [userId, userId, userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async getPendingRequests(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT u.id, u.username, u.first_name, u.last_name, u.avatar, 
                fr.created_at AS request_date
         FROM friend_requests fr
         JOIN users u ON fr.from_user_id = u.id
         WHERE fr.to_user_id = ? AND fr.status = 'pending'
         ORDER BY fr.created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async getSentRequests(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT u.id, u.username, u.first_name, u.last_name, u.avatar, 
                fr.created_at AS request_date
         FROM friend_requests fr
         JOIN users u ON fr.to_user_id = u.id
         WHERE fr.from_user_id = ? AND fr.status = 'pending'
         ORDER BY fr.created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async getStatus(userId, friendId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT status FROM friendships 
         WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
        [userId, friendId, friendId, userId],
        (err, row) => {
          if (err) return reject(err);
          if (row) return resolve({ status: 'friends', ...row });
          
          db.get(
            `SELECT status, from_user_id FROM friend_requests 
             WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)
             AND status = 'pending'`,
            [userId, friendId, friendId, userId],
            (err, row) => {
              if (err) return reject(err);
              if (row) {
                const requestType = row.from_user_id === userId ? 'sent' : 'received';
                return resolve({ status: 'request', requestType, ...row });
              }
              
              resolve({ status: 'none' });
            }
          );
        }
      );
    });
  }

  static async getOnlineFriendsCount(userId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as count
         FROM users u
         JOIN friendships f ON (f.user1_id = u.id OR f.user2_id = u.id)
         WHERE (f.user1_id = ? OR f.user2_id = ?) AND u.id != ? 
           AND f.status = 'accepted' AND u.is_online = TRUE`,
        [userId, userId, userId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row ? row.count : 0);
        }
      );
    });
  }
}

module.exports = Friendship;