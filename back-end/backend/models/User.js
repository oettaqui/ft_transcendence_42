const bcrypt = require('bcrypt');
const { db } = require('../config/database');

class User {
  constructor(data = {}) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.first_name || data.firstName;
    this.lastName = data.last_name || data.lastName;
    this.avatar = data.avatar;
    this.googleId = data.google_id || data.googleId;
    this.isOnline = data.is_online || data.isOnline || false;
    this.lastLogin = data.last_login || data.lastLogin;
    this.createdAt = data.created_at || data.createdAt;
    this.updatedAt = data.updated_at || data.updatedAt;
  }

  // Create a new user
  static async create({ username, email, password, firstName, lastName, googleId = null, avatar = null }) {
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
  }

  // Find user by email
  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return reject(err);
        resolve(row ? new User(row) : null);
      });
    });
  }

  // Find user by ID
  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row ? new User(row) : null);
      });
    });
  }

  // Find user by Google ID
  static async findByGoogleId(googleId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE google_id = ?', [googleId], (err, row) => {
        if (err) {
          console.error('Database error in findByGoogleId:', err);
          return reject(err);
        }
        resolve(row ? new User(row) : null);
      });
    });
  }

  // Search users by query
  static async search(query, currentUserId, limit = 10) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, username, first_name, last_name, avatar, is_online, last_login
         FROM users
         WHERE (username LIKE ? OR first_name LIKE ? OR last_name LIKE ?)
           AND id != ?
         LIMIT ?`,
        [`%${query}%`, `%${query}%`, `%${query}%`, currentUserId, limit],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows.map(row => new User(row)));
        }
      );
    });
  }

  // Update user profile
  async updateProfile({ firstName, lastName, avatar }) {
    return new Promise((resolve, reject) => {
      const updates = [];
      const params = [];
      
      if (firstName !== undefined) {
        updates.push('first_name = ?');
        params.push(firstName);
        this.firstName = firstName;
      }
      if (lastName !== undefined) {
        updates.push('last_name = ?');
        params.push(lastName);
        this.lastName = lastName;
      }
      if (avatar !== undefined) {
        updates.push('avatar = ?');
        params.push(avatar);
        this.avatar = avatar;
      }
      
      if (updates.length === 0) {
        return resolve(0);
      }
      
      updates.push('updated_at = CURRENT_TIMESTAMP');
      params.push(this.id);
      
      db.run(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        params,
        function(err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }

  // Update online status
  async updateOnlineStatus(isOnline) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET is_online = ?, last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [isOnline, this.id],
        function(err) {
          if (err) return reject(err);
          this.isOnline = isOnline;
          resolve(this.changes);
        }.bind(this)
      );
    });
  }

  // Update password
  async updatePassword(newPassword) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newPassword, this.id],
        function(err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Hash password
  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  // Get user data without password
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      isOnline: this.isOnline,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;