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
                CREATE TABLE IF NOT EXISTS game(
                    Game_id INTEGER PRIMARY KEY,
                    user1_id INTEGER,
                    user2_id INTEGER,
                    score_p1 INTEGER,
                    score_p2 INTEGER,
                    game_duration INTEGER,
                    type_game TEXT,
                    player_won INTEGER,
                    player_lose INTEGER
                )
                `, (err) => {
                    if(err) return reject(err);

                });
        })
    })
}

const closeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.export  = {
  db,
  initDatabase,
  closeDatabase
};