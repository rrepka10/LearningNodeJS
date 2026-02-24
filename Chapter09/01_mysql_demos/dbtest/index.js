// index.js
// This demonstrates access to a mySQL data base
// It creates a user called Carol.
// Use transactions.js to update her name to Carol Danvers

//Use these mySQL commands to setup your data base on your server
/*  
drop database if exists testDB;
 
CREATE DATABASE testDB;
use testDB;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL
);

show tables;

select * from testdb;
*/

const { pool, run } = require('./db');
const async = require('async');

function createThenFetchUser(email, name, done) {
  async.waterfall(
    [
      // 1) Insert user
      function insertUser(next) {
        const sql = 'INSERT INTO users (email, name) VALUES (?, ?)';
        run(sql, [email, name], (err, result) => {
          if (err) {
            // handle duplicate email nicely
            if (err.message.includes('Database operation failed.')) {
              // we already sanitized message in db.js
            }
            return next(err);
          }
          next(null, result.insertId);
        });
      },

      // 2) Fetch newly inserted user
      function fetchUser(insertId, next) {
        const sql = 'SELECT id, email, name FROM users WHERE id = ?';
        run(sql, [insertId], (err, rows) => {
          if (err) return next(err);
          if (!rows || rows.length === 0) {
            return next(new Error('Inserted user not found.'));
          }
          next(null, rows[0]);
        });
      }
    ],
    // Final callback
    (err, user) => {
      if (err) return done(err);
      done(null, user);
    }
  );
}

// Example run
createThenFetchUser('carol@example.com', 'Carol', (err, user) => {
  if (err) {
    console.error('Flow error:', err.message);
  } else {
    console.log('Created + fetched:', user);
  }
  // optional: end pool if this is a one-off script
  pool.end();
});