const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbPath = process.env.DB_PATH || path.join('./data/', 'auth.db');
let db = null ;

// const dbDir = path.dirname(dbPath);
// if (!fs.existsSync(dbDir)) {
//   fs.mkdirSync(dbDir, { recursive: true });
//   console.log(`📁 Created database directory: ${dbDir}`);
// }

console.log(`🗄️  Database path: ${dbPath}`);
async  function connect(){
	return new Promise((resolve, reject) => {
		db = new sqlite3.Database(dbPath, (err) => {
			if (err) {
				console.error('❌ Error opening database:', err.message );
				reject(err);
			}
			else{
				console.log('✅ Connected to SQLite database');
				resolve(db);
			}
		});
	});
}


module.exports = {connect};
