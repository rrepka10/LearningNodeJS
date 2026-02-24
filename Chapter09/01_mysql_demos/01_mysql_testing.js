// Sample SQL - requires MySQL community version
//    https://dev.mysql.com/downloads/mysql/  port 3306, xport 33060
// Requires an .env file with the following:
// Sample .env  ROOTPW=
//              USERID=
//              USERPW=
// Changed to ignore errors to allow multiple entires.  This was switched to 
// connection pooling to get it to work.  

// Useful commands for the SQL command line, you must create the SQL data base 
// and tables 
/*
drop database if exists photoalbums;
drop table if exists albums;

create database photoalbums default character set utf8 default collate utf8_general_ci;
use photoalbums;
      
show tables; 
select * from albums;  - shows the contents of the table 

CREATE TABLE IF NOT EXISTS users 
( user_uuid VARCHAR(50) UNIQUE PRIMARY KEY,
  email_address VARCHAR(150) UNIQUE,

  display_name VARCHAR(100) NOT NULL,
  password VARCHAR(100),

  first_seend_date BIGINT,
  last_modified_date BIGINT,
  deleted BOOL DEFAULT false,

  INDEX(email_address),
  INDEX(user_uuid)
);

CREATE TABLE IF NOT EXISTS albums
( name VARCHAR(50) UNIQUE PRIMARY KEY,
  title VARCHAR(225),
  date VARCHAR(225),
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS photos
( filename VARCHAR(225) UNIQUE PRIMARY KEY,
  album_name VARCHAR(225),
  description VARCHAR(255),
  date VARCHAR(225)
);

*/ 

var mysql = require('mysql2'),
    async = require('async');
const { useSyncExternalStore } = require('react');

// Get our secrets from a .env file
// Sample .env  ROOTPW=
//              USERID=
//              USERPW=
require('dotenv').config();

var host = "localhost";
var database = "PhotoAlbums";
var user = process.env.USERID;
var password = process.env.USERPW;

/**
 * Don't forget that for waterfall, it will stop and call the final
 * "cleanup" function whenever it sees an error has been passed to 
 * one of the callback functions.
 *
 * Also, if a parameter is given to the callback, it will include
 * those in the next function called in the waterfall.
 */
var pool;

async.waterfall([
  // 1. create database connection
  function(cb) {
    pool = mysql.createPool({
      host: host,
      user: user,
      password: password,
      database: database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
      });
    cb(null);
  }, 

  // 2. let's add a couple of albums. we will run them as separate queries.
  function (cb) {
    console.log("\n** 2a. create albums.");
    const sql =  "INSERT IGNORE INTO Albums VALUES (?, ?, ?, ?)";
    pool.execute(sql, [ "italy2012", "Spring Festival in Italy", "2012-02-15",
              "I went to Italy for Spring Festival" ], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null);
      });
    },

  function (cb) {
    console.log("\n** 2b. create albums.");
        
    const sql = "INSERT IGNORE INTO Albums VALUES (?, ?, ?, ?)";
    pool.execute(sql, [ "australia2010", "Vacation Down Under", "2010-10-20",
              "Spent some time in Australia visiting Friends" ], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null);
      });                
    },

  function (cb) {
    console.log("\n** 2c. create albums.");   
    const sql = "INSERT IGNORE INTO Albums VALUES (?, ?, ?, ?)";
    pool.execute(sql, [ "japan2010", "Programming in Tokyo", "2010/06/10",
              "I worked in Tokyo for a while." ], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null);
      });         
    },
    
  // 3. let's add some photos to albums
  function ( cb) {
    // mysql is cool with this date format.
    const pix = [
            { filename: "picture_01.jpg",
              albumid: "italy2012",
              description: "rome!",
              date: "2012/02/15 16:20:40" },
            { filename: "picture_04.jpg",
              albumid: "italy2012",
              description: "fontana di trevi",
              date: "2012/02/19 16:20:40" },
            { filename: "picture_02.jpg",
              albumid: "italy2012",
              description: "it's the vatican!",
              date: "2012/02/17 16:35:04" },
            { filename: "picture_05.jpg",
              albumid: "italy2012",
              description: "rome!",
              date: "2012/02/19 16:20:40" },
            { filename: "picture_03.jpg",
              albumid: "italy2012",
              description: "spanish steps",
              date: "2012/02/18 16:20:40" },

            { filename: "photo_05.jpg",
              albumid: "japan2010",
              description: "something nice",
              date: "2010/06/14 12:21:40" },
            { filename: "photo_01.jpg",
              albumid: "japan2010",
              description: "tokyo tower!",
              date: "2010/06/11 12:20:40" },
            { filename: "photo_06.jpg",
              albumid: "japan2010",
              description: "kitty cats",
              date: "2010/06/14 12:23:40" },
            { filename: "photo_03.jpg",
              albumid: "japan2010",
              description: "shinjuku is nice",
              date: "2010/06/12 08:40:40" },
            { filename: "photo_04.jpg",
              albumid: "japan2010",
              description: "eating sushi",
              date: "2010/06/12 08:34:40" },
            { filename: "photo_02.jpg",
              albumid: "japan2010",
              description: "roppongi!",
              date: "2010/06/12 07:44:40" },
            { filename: "photo_07.jpg",
              albumid: "japan2010",
              description: "moo cow oink pig woo!!",
              date: "2010/06/15 12:55:40" },

            { filename: "photo_001.jpg",
              albumid: "australia2010",
              description: "sydney!",
              date: "2010/10/20 07:44:40" },
            { filename: "photo_002.jpg",
              albumid: "australia2010",
              description: "asdfasdf!",
              date: "2010/10/20 08:24:40" },
            { filename: "photo_003.jpg",
              albumid: "australia2010",
              description: "qwerqwr!",
              date: "2010/10/20 08:55:40" },
            { filename: "photo_004.jpg",
              albumid: "australia2010",
              description: "zzzxcv zxcv",
              date: "2010/10/21 14:29:40" },
            { filename: "photo_005.jpg",
              albumid: "australia2010",
              description: "ipuoip",
              date: "2010/10/22 19:08:40" },
            { filename: "photo_006.jpg",
              albumid: "australia2010",
              description: "asdufio",
              date: "2010/10/22 22:15:40" }
        ];

    const sql = "INSERT IGNORE INTO Photos (filename, album_name, description, date) VALUES (?, ?, ?, ?)";
    console.log("\n** 3. Add pictures.");

    //    forEachSeries(arrray, function(index, callback)
    async.forEachSeries( pix,
      // run the query and call clbk to do next in array
      // we do in serial because connection only does
      // one thing at a time.
      (item, clbk) => {
 //       console.log("photos run loop", item.filename);
        pool.execute(sql, [ item.filename, item.albumid, item.description, 
                                    item.date ], (err, result) => {
          if (err) {
            console.error('MySQL error:', err.code, err.sqlMessage);
            return cb(new Error('Database operation failed.'));
          } // end err
          clbk(); // success callback
          } // end task
        ) // end execute
      } // end item 
    );  // end foreach   

   cb(null);
  },  // end function
           
  function (cb) {
    // 4. list all albums
    console.log("\n** 4. list albums");
    const sql = "SELECT * FROM Albums ORDER BY date DESC";
    pool.execute(sql, [], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null, result);
      });         
    },
 
  function (rows, cb) {
    console.log(" -> dumping albums:");
    for (var i = 0; i < rows.length; i++) {
      console.log(" -> Album: " + rows[i].name
                        + " (" + rows[i].date + ")");
    } // End for 

    // 5. find italy2012 album.
    console.log("\n** 5. Find italy 2012 album.");
    const sql = "SELECT * FROM Albums WHERE name = ?";
    pool.execute(sql, ["italy2012"], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null, result);
      }); // end pool.execute
    },

  function (rows, cb) {
    console.log(" -> Dumping italy2012:");
    for (var i = 0; i < rows.length; i++) {
      console.log("   -> Album: " + rows[i].name
                        + " (" + rows[i].date + ")");
    }

    // 6. find all photos in italy2012 album. sort by date,
    //    and return subset
    console.log("\n** 6. Photos search for italy2012 album.");
    const sql = "SELECT * FROM Photos WHERE album_name = ? ORDER BY date DESC LIMIT ?, ?";
    pool.execute(sql, ["italy2012", "2", "5"], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null, result);
      }); // end pool.execute
    },

  function (rows, cb) {
    console.log(rows);
    console.log(" -> dumping italy2012 photos:");
    for (var i = 0; i < rows.length; i++) {
      console.log("    Photo: " + rows[i].filename
                        + " (" + rows[i].date + ")");
    }

    // 7. replace the description in a photo
    console.log("\n** 7. update photo.");
    const sql = "UPDATE Photos SET description = ? \
             WHERE album_name = ? AND filename = ?";
    pool.execute(sql, ["NO SHINJUKU! BAD!", "italy2012", "picture_03.jpg"], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null, result);
      }); // end pool.execute
    },

  function (results, cb) {
    console.log("   -> updated rows: " + results.affectedRows);
    if (results.affectedRows != 1) {
      cb(new Error("CRAP TEST 7 didn't affect 1 row!"));
      return;
      }

    // 8. delete a photo
    console.log("\n** 8. delete photo.");
    const sql = "DELETE FROM Photos WHERE filename = ? AND album_name = ?";
    pool.execute(sql, [ "photo_04.jpg", "japan2010" ], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null, result);
      }); // end pool.execute
    },

  function (results, cb) {
    console.log("   -> deleted rows: " + results.affectedRows);
    if (results.affectedRows != 1) {
      cb(new Error("CRAP TEST 8 didn't affect 1 row!"));
      return;
    }

    // 9. delete an entire album and its photos.
    // a. delete photos
    console.log("\n** 9. delete entire album and photos");
    const sql = "DELETE FROM Photos WHERE album_name = ?";
    pool.execute(sql, ["australia2012"], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null, result);
      }); // end pool.execute
    },

  function (results, cb) {
    console.log(" -> delete photos rows: " + results.affectedRows);
    
    //  b. delete the album
    const sql = "DELETE FROM Albums WHERE name = ?";
    pool.execute(sql, ["australia2012"], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null, result);
      }); // end pool.execute
    },

  function (results, cb) {
    console.log(" -> delete album rows: " + results.affectedRows);

    // 10. ask for an album that doesn't exist.
    console.log("\n** 10. Search for non-existant album.");
    const sql = "SELECT * FROM Albums WHERE name = ?";
    pool.execute(sql, ["asdfasdf"], (err, result) => {
      if (err) {
        console.error('MySQL error:', err.code, err.sqlMessage);
        return cb(new Error('Database operation failed.'));
      }
      cb(null, result);
      }); // end pool.execute
    },

  function (rows, cb) {
    console.log(" -> asked for bogus, got " + rows.length + " rows");
    cb(null);
    }
],

// waterfall cleanup function
function (err, results) {
    if (err) {
        console.log("Aw, there was an error: ");
        console.log(err);
    } else {
        console.log("All operations completed without error.");
    }

    pool.end();
});



