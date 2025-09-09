const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
    this.coalition = data.coalition;
    this.colorTheme = data.color_theme || data.colorTheme;
    this.googleId = data.google_id || data.googleId;
    this.intraId = data.intra_id || data.intraId; 
    this.isOnline = data.is_online || data.isOnline || false;
    this.lastLogin = data.last_login || data.lastLogin;
    this.createdAt = data.created_at || data.createdAt;
    this.updatedAt = data.updated_at || data.updatedAt;
    
    this.emailVerified = data.email_verified || data.emailVerified || false;
    this.emailVerificationToken = data.email_verification_token || data.emailVerificationToken;
    this.emailVerificationExpires = data.email_verification_expires || data.emailVerificationExpires;
    
    this.twoFactorEnabled = data.two_factor_enabled || data.twoFactorEnabled || false;
    this.twoFactorMethod = data.two_factor_method || data.twoFactorMethod;
    this.twoFactorSecret = data.two_factor_secret || data.twoFactorSecret;
    this.twoFactorCode = data.two_factor_code || data.twoFactorCode;
    this.twoFactorCodeExpires = data.two_factor_code_expires || data.twoFactorCodeExpires;
  }

  static async create({ username, email, password, firstName, lastName,avatar,coalition,color_theme, googleId = null, intraId = null}) {
    return new Promise((resolve, reject) => {
      const emailVerified = googleId || intraId ? true : false;
      console.log(`
      username   :${username}
      email      :${email}
      password   :${password}
      firstname  :${firstName}
      googleId   :${googleId}
      intraId    :${intraId}
      avatar     :${avatar}
      coalition  :${coalition}
      color_theme:${color_theme}
      googleId   :${googleId}
      intraId    :${intraId}
                    `);

      db.run(
        `INSERT INTO users 
         (username, email, password, first_name, last_name, google_id, intra_id, avatar,coalition,color_theme, is_online, email_verified) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?)`,
        [username, email, password, firstName, lastName, googleId, intraId, avatar,coalition,color_theme, emailVerified],
        function(err) {
          if (err) return reject(err);
          
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

  static async createEmailVerificationToken(userId) {
    return new Promise((resolve, reject) => {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); 
      
      db.run(
        `UPDATE users 
         SET email_verification_token = ?, email_verification_expires = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [token, expires.toISOString(), userId],
        function(err) {
          if (err) return reject(err);
          resolve(token);
        }
      );
    });
  }

  static async verifyEmailToken(token) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users 
         WHERE email_verification_token = ? 
         AND email_verification_expires > CURRENT_TIMESTAMP`,
        [token],
        (err, row) => {
          if (err) return reject(err);
          resolve(row ? new User(row) : null);
        }
      );
    });
  }
  
    static async updateIntraId(userId, intraId) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET intra_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [intraId, userId],
        function(err) {
          if (err) return reject(err);
          resolve(this.changes);
        }
      );
    });
  }
  async verifyEmail() {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users 
         SET email_verified = TRUE, 
             email_verification_token = NULL, 
             email_verification_expires = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [this.id],
        function(err) {
          if (err) return reject(err);
          this.emailVerified = true;
          this.emailVerificationToken = null;
          this.emailVerificationExpires = null;
          resolve(this.changes);
        }.bind(this)
      );
    });
  }

  async resendEmailVerification() {
    if (this.emailVerified) {
      throw new Error('Email is already verified');
    }
    
    const token = await User.createEmailVerificationToken(this.id);
    this.emailVerificationToken = token;
    return token;
  }

  static async create2FACode(userId, purpose = 'login') {
    return new Promise((resolve, reject) => {
      const code = Math.floor(100000 + Math.random() * 900000).toString(); 
      const expires = new Date(Date.now() + 10 * 60 * 1000); 
      
      db.run(
        `UPDATE users 
         SET two_factor_code = ?, two_factor_code_expires = ?, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [code, expires.toISOString(), userId],
        function(err) {
          if (err) return reject(err);
          resolve(code);
        }
      );
    });
  }

  static async verify2FACode(userId, code, purpose = 'login') {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users 
         WHERE id = ? AND two_factor_code = ? 
         AND two_factor_code_expires > CURRENT_TIMESTAMP`,
        [userId, code],
        (err, row) => {
          if (err) return reject(err);
          
          if (row) {
            db.run(
              `UPDATE users 
               SET two_factor_code = NULL, two_factor_code_expires = NULL
               WHERE id = ?`,
              [userId],
              (clearErr) => {
                if (clearErr) console.error('Error clearing 2FA code:', clearErr);
                resolve(true);
              }
            );
          } else {
            resolve(false);
          }
        }
      );
    });
  }

  async enable2FA(method = 'email') {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users 
         SET two_factor_enabled = TRUE, 
             two_factor_method = ?, 
             backup_codes = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [method, JSON.stringify(), this.id],
        function(err) {
          if (err) return reject(err);
          this.twoFactorEnabled = true;
          this.twoFactorMethod = method;
          resolve(this.changes);
        }.bind(this)
      );
    });
  }

  async disable2FA() {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE users 
         SET two_factor_enabled = FALSE, 
             two_factor_method = NULL, 
             two_factor_secret = NULL,
             backup_codes = NULL,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [this.id],
        function(err) {
          if (err) return reject(err);
          this.twoFactorEnabled = false;
          this.twoFactorMethod = null;
          this.twoFactorSecret = null;
          resolve(this.changes);
        }.bind(this)
      );
    });
  }


  get2FAStatus() {
    return {
      twoFactorEnabled: this.twoFactorEnabled,
      method: this.twoFactorMethod,
      emailVerified: this.emailVerified,
    };
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) return reject(err);
        resolve(row ? new User(row) : null);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row ? new User(row) : null);
      });
    });
  }

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

  static async findByIntraId(intraId) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE intra_id = ?', [intraId], (err, row) => {
        if (err) {
          console.error('Database error in findByIntraId:', err);
          return reject(err);
        }
        resolve(row ? new User(row) : null);
      });
    });
  }

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

  static async getAllUsers(currentUserId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT id, username, first_name, last_name, avatar, coalition, color_theme,
                is_online, last_login, created_at, email_verified
        FROM users 
        WHERE id != ?
        ORDER BY is_online DESC, username ASC`,
        [currentUserId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async getOnlineUsersCount(currentUserId) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT COUNT(*) as count 
        FROM users 
        WHERE id != ? AND is_online = TRUE`,
        [currentUserId],
        (err, row) => {
          if (err) return reject(err);
          resolve(row ? row.count : 0);
        }
      );
    });
  }

  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  static async hashPassword(password) {
    return await bcrypt.hash(password, 12);
  }

  toJSON() {
    const { password, emailVerificationToken, twoFactorSecret, twoFactorCode, ...userWithoutSensitiveData } = this;
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      coalition : this.coalition,
      colorTheme : this.colorTheme,
      isOnline: this.isOnline,
      lastLogin: this.lastLogin,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      emailVerified: this.emailVerified,
      twoFactorEnabled: this.twoFactorEnabled,
      twoFactorMethod: this.twoFactorMethod,
      googleId:this.googleId,
      intraId:this.intraId,
    };
  }
}

module.exports = User;

