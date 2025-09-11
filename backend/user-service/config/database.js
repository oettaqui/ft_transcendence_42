const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.join('./data/auth.db', 'auth.db');

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`📁 Created database directory: ${dbDir}`);
}

console.log(`🗄️  Database path: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT,
          first_name TEXT,
          last_name TEXT,
          avatar TEXT,
          coalition TEXT,
          color_theme TEXT,
          google_id INTEGER UNIQUE,
          intra_id INTEGER UNIQUE,
          is_online BOOLEAN DEFAULT FALSE,
          last_login DATETIME,
          
          -- Email verification fields
          email_verified BOOLEAN DEFAULT FALSE,
          email_verification_token TEXT,
          email_verification_expires DATETIME,
          
          -- 2FA fields
          two_factor_enabled BOOLEAN DEFAULT FALSE,
          two_factor_method TEXT,
          two_factor_secret TEXT,
          backup_codes TEXT,
          two_factor_code TEXT,
          two_factor_code_expires DATETIME,
          
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) return reject(err);
        db.all("PRAGMA table_info(users)", (err, columns) => {
          if (err) return reject(err);
          
          const hasIntraId = columns.some(col => col.name === 'intra_id');
          
          if (!hasIntraId) {
            console.log('🔄 Adding Intra ID support to existing users table...');
            db.run('ALTER TABLE users ADD COLUMN intra_id INTEGER UNIQUE', (err) => {
              if (err && !err.message.includes('duplicate column name')) {
                console.error('Error adding intra_id column:', err);
              } else {
                console.log('✅ Added intra_id column to users table');
              }
              continueInit();
            });
          } else {
            continueInit();
          }
        });
        
        function continueInit() {
          db.run(`
            CREATE TABLE IF NOT EXISTS user_stats (
              user_id INTEGER PRIMARY KEY,
              games_played INTEGER DEFAULT 0,
              games_won INTEGER DEFAULT 0,
              games_lost INTEGER DEFAULT 0,
              ranking_points INTEGER DEFAULT 1000,
              user_rank INTEGER DEFAULT -1,
              coins INTEGER DEFAULT 0,
              exp INTEGER DEFAULT 0,
              best_score INTEGER DEFAULT 0,
              FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            )
          `, (err) => {
            if (err) return reject(err);
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
              db.run(`
                CREATE TABLE IF NOT EXISTS friend_requests (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  from_user_id INTEGER NOT NULL,
                  to_user_id INTEGER NOT NULL,
                  status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'declined', 'cancelled')),
                  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  up CREATE TABLE IF NOT EXISTS usedated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                  FOREIGN KEY (from_user_id) REFERENCES users (id) ON DELETE CASCADE,
                  FOREIGN KEY (to_user_id) REFERENCES users (id) ON DELETE CASCADE,
                  UNIQUE(from_user_id, to_user_id)
                )
              `, (err) => {
                if (err) return reject(err);
                db.run('CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)', (err) => {
                  if (err) console.error('Error creating google_id index:', err);
                });
                
                db.run('CREATE INDEX IF NOT EXISTS idx_users_intra_id ON users(intra_id)', (err) => {
                  if (err) console.error('Error creating intra_id index:', err);
                });
                
                db.run('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)', (err) => {
                  if (err) console.error('Error creating email index:', err);
                });
                
                console.log('✅ Auth Service database initialized successfully with Google & Intra OAuth, email verification and 2FA support');
                resolve();
              });
            });
          });
        }
      });
    });
  });
};
const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

module.exports = {
  db,
  initDatabase,
  closeDatabase
};
