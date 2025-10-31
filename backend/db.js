import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'certificates.db'), (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
  } else {
    console.log('✅ Connected to SQLite database');
    initializeSchema();
  }
});

db.configure('busyTimeout', 10000);

function initializeSchema() {
  db.serialize(() => {
    // Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) console.error('❌ Error creating users table:', err);
      else console.log('✅ Users table ready');
    });

    // Certificates table
    db.run(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        holder_name TEXT NOT NULL,
        issuer TEXT,
        cert_date TEXT,
        cert_hash TEXT NOT NULL,
        verified BOOLEAN DEFAULT 0,
        verified_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `, (err) => {
      if (err) console.error('❌ Error creating certificates table:', err);
      else console.log('✅ Certificates table ready');
    });

    // Ledger table (immutable chain)
    db.run(`
      CREATE TABLE IF NOT EXISTS ledger (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        certificate_id INTEGER NOT NULL,
        record_hash TEXT NOT NULL,
        prev_hash TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (certificate_id) REFERENCES certificates (id)
      )
    `, (err) => {
      if (err) console.error('❌ Error creating ledger table:', err);
      else console.log('✅ Ledger table ready');
    });
  });
}

export default db;
