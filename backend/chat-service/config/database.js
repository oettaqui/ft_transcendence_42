const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const dbPath = process.env.DB_PATH || path.join('../data/auth.db', 'auth.db');
let db = null ;

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


