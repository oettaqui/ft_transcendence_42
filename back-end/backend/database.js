const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Create database connection
const dbPath = path.join(__dirname, 'pingpong.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with all required tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table with additional fields for Google auth and profile
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT,
          first_name TEXT,
          last_name TEXT,
          avatar TEXT,
          google_id INTEGER UNIQUE,
          is_online BOOLEAN DEFAULT FALSE,
          last_login DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) return reject(err);
        
        // Create user stats table
        db.run(`
          CREATE TABLE IF NOT EXISTS user_stats (
            user_id INTEGER PRIMARY KEY,
            games_played INTEGER DEFAULT 0,
            games_won INTEGER DEFAULT 0,
            games_lost INTEGER DEFAULT 0,
            ranking_points INTEGER DEFAULT 1000,
            best_score INTEGER DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
          )
        `, (err) => {
          if (err) return reject(err);
          
          // Create friendships table - FIXED HERE
          db.run(`
            CREATE TABLE IF NOT EXISTS friendships (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              user1_id INTEGER NOT NULL,
              user2_id INTEGER NOT NULL,
              status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'declined')),
              action_user_id INTEGER NOT NULL,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (user1_id) REFERENCES users (id) ON DELETE CASCADE,
              FOREIGN KEY (user2_id) REFERENCES users (id) ON DELETE CASCADE,
              FOREIGN KEY (action_user_id) REFERENCES users (id) ON DELETE CASCADE,
              UNIQUE(user1_id, user2_id)
            )
          `, (err) => {
            if (err) return reject(err);
            
            // Create friend_requests table
            db.run(`
              CREATE TABLE IF NOT EXISTS friend_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                from_user_id INTEGER NOT NULL,
                to_user_id INTEGER NOT NULL,
                status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'declined', 'cancelled')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (from_user_id) REFERENCES users (id) ON DELETE CASCADE,
                FOREIGN KEY (to_user_id) REFERENCES users (id) ON DELETE CASCADE,
                UNIQUE(from_user_id, to_user_id)
              )
            `, (err) => {
              if (err) return reject(err);
              console.log('Database initialized successfully');
              resolve();
            });
          });
        });
      });
    });
  });
};

// User Management Functions
const createUser = (username, email, password, firstName, lastName, googleId = null, avatar = null) => {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO users 
       (username, email, password, first_name, last_name, google_id, avatar, is_online) 
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
      [username, email, password, firstName, lastName, googleId, avatar],
      function(err) {
        if (err) return reject(err);
        
        // Initialize user stats
        db.run(
          'INSERT INTO user_stats (user_id) VALUES (?)',
          [this.lastID],
          (err) => {
            if (err) return reject(err);
            resolve(this.lastID);
          }
        );
      }
    );
  });
};

const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const getUserByGoogleId = (googleId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM users WHERE google_id = ?', [googleId], (err, row) => {
      if (err) {
        console.error('Database error in getUserByGoogleId:', err);
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
};

const updateUserProfile = (userId, firstName, lastName, avatar) => {
  return new Promise((resolve, reject) => {
    const updates = [];
    const params = [];
    
    if (firstName !== undefined) {
      updates.push('first_name = ?');
      params.push(firstName);
    }
    if (lastName !== undefined) {
      updates.push('last_name = ?');
      params.push(lastName);
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?');
      params.push(avatar);
    }
    
    if (updates.length === 0) {
      return resolve(0);
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(userId);
    
    db.run(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      params,
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

const updateUserOnlineStatus = (userId, isOnline) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET is_online = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [isOnline, userId],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

const updateUserPassword = (userId, newPassword) => {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [newPassword, userId],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

// User Stats Functions
const getUserStats = (userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM user_stats WHERE user_id = ?',
      [userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row || {
          games_played: 0,
          games_won: 0,
          games_lost: 0,
          ranking_points: 1000,
          best_score: 0
        });
      }
    );
  });
};

const updateUserStats = (userId, stats) => {
  return new Promise((resolve, reject) => {
    const updates = [];
    const params = [];
    
    if (stats.games_played !== undefined) {
      updates.push('games_played = ?');
      params.push(stats.games_played);
    }
    if (stats.games_won !== undefined) {
      updates.push('games_won = ?');
      params.push(stats.games_won);
    }
    if (stats.games_lost !== undefined) {
      updates.push('games_lost = ?');
      params.push(stats.games_lost);
    }
    if (stats.ranking_points !== undefined) {
      updates.push('ranking_points = ?');
      params.push(stats.ranking_points);
    }
    if (stats.best_score !== undefined) {
      updates.push('best_score = ?');
      params.push(stats.best_score);
    }
    
    if (updates.length === 0) {
      return resolve(0);
    }
    
    params.push(userId);
    
    db.run(
      `UPDATE user_stats SET ${updates.join(', ')} WHERE user_id = ?`,
      params,
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

// Friend System Functions
const sendFriendRequest = (fromUserId, toUserId) => {
  return new Promise((resolve, reject) => {
    // Check if friendship already exists
    db.get(
      `SELECT * FROM friendships 
       WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
      [fromUserId, toUserId, toUserId, fromUserId],
      (err, row) => {
        if (err) return reject(err);
        if (row) {
          return reject(new Error('Friendship or request already exists'));
        }
        
        // Check if request already exists
        db.get(
          `SELECT * FROM friend_requests 
           WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)`,
          [fromUserId, toUserId, toUserId, fromUserId],
          (err, row) => {
            if (err) return reject(err);
            if (row) {
              return reject(new Error('Friend request already exists'));
            }
            
            // Create new request
            db.run(
              `INSERT INTO friend_requests 
               (from_user_id, to_user_id, status, created_at) 
               VALUES (?, ?, 'pending', CURRENT_TIMESTAMP)`,
              [fromUserId, toUserId],
              function(err) {
                if (err) reject(err);
                else resolve(this.lastID);
              }
            );
          }
        );
      }
    );
  });
};

const acceptFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Update the friend request status
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
          
          // Create friendship record
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
};

const declineFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE friend_requests 
       SET status = 'declined', updated_at = CURRENT_TIMESTAMP 
       WHERE from_user_id = ? AND to_user_id = ? AND status = 'pending'`,
      [friendId, userId],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

const removeFriend = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `DELETE FROM friendships 
       WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
      [userId, friendId, friendId, userId],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

const cancelFriendRequest = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE friend_requests 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
       WHERE from_user_id = ? AND to_user_id = ? AND status = 'pending'`,
      [userId, friendId],
      function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      }
    );
  });
};

const getUserFriends = (userId) => {
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
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const getPendingFriendRequests = (userId) => {
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
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const getSentFriendRequests = (userId) => {
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
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const searchUsers = (query, currentUserId, limit = 10) => {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT id, username, first_name, last_name, avatar, is_online, last_login
       FROM users
       WHERE (username LIKE ? OR first_name LIKE ? OR last_name LIKE ?)
         AND id != ?
       LIMIT ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`, currentUserId, limit],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
};

const getFriendshipStatus = (userId, friendId) => {
  return new Promise((resolve, reject) => {
    // Check if they are friends
    db.get(
      `SELECT status FROM friendships 
       WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)`,
      [userId, friendId, friendId, userId],
      (err, row) => {
        if (err) return reject(err);
        if (row) return resolve({ status: 'friends', ...row });
        
        // Check for pending requests
        db.get(
          `SELECT status FROM friend_requests 
           WHERE (from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)`,
          [userId, friendId, friendId, userId],
          (err, row) => {
            if (err) return reject(err);
            if (row) return resolve({ status: 'request', ...row });
            
            // No relationship
            resolve({ status: 'none' });
          }
        );
      }
    );
  });
};

const getOnlineFriendsCount = (userId) => {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT COUNT(*) as count
       FROM users u
       JOIN friendships f ON (f.user1_id = u.id OR f.user2_id = u.id)
       WHERE (f.user1_id = ? OR f.user2_id = ?) AND u.id != ? 
         AND f.status = 'accepted' AND u.is_online = TRUE`,
      [userId, userId, userId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? row.count : 0);
      }
    );
  });
};

// Close database connection
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

module.exports = {
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
};