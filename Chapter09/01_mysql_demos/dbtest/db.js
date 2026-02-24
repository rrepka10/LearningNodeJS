// Very simple example of mySQL access, use your DB credentials
// db.js

// Update the user and password to use your mySQL databae

const mysql = require('mysql2'); // callback API
const async = require('async');


const pool = mysql.createPool({
  host: 'localhost',
  user: '',
  password: '',
  database: 'testdb',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper: run a single statement via pool
function run(sql, params, cb) {
  pool.execute(sql, params, (err, results) => {
    if (err) {
      console.error('MySQL error:', err.code, err.sqlMessage);
      return cb(new Error('Database operation failed.'));
    }
    cb(null, results);
  });
}

module.exports = { pool, run };