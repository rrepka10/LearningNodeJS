// Fixed issues with db opening 
/*
var Db = require('mongodb').db
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server
*/
const { MongoClient } = require('mongodb');
var async = require('async');
var local = require("../local.config.js");

// Get the server setting from the json file
var host = local.config.db_config.host
    ? local.config.db_config.host
    : 'localhost';
var port = local.config.db_config.port
    ? local.config.db_config.port
    : '27017';
var ps = local.config.db_config.poolSize
    ? local.config.db_config.poolSize : 5;

var client;

    /*
var db = new Db('PhotoAlbums', 
                new Server(host, port, 
                           { auto_reconnect: true,
                             poolSize: ps}),
                { w: 1 });
*/
/**
 * Currently for initialisation, we just want to open
 * the database.  We won't even attempt to start up
 * if this fails, as it's pretty pointless.
 */
exports.init = function (callback) {
    async.waterfall([
        // 1. open database connection
        function (cb) {
          
            //    db.open(cb);
            // mongodb://localhost:27017
            var url = "mongodb://" + host + ":" + port;
            console.log("** 1. open db ", url);
            MongoClient.connect(url)  
                .then(retclient => {client = retclient; cb(null)})
                .catch(err => cb(make_error(err, "Could not connect to MongoDB server")));        
        },

        // 2. create collections for our albums and photos. if
        //    they already exist, then we're good.
        function (cb) {
         //   db.collection("albums", cb);
            var dbName = local.config.db_config.database;
            console.log("** 2. access albums and photos collections.", dbName);
            db = client.db(dbName);  // new
            if (db == null) {cb(make_error(null, "Could not connect to client server"));} // new
    
            // db.collection("albums", cb);
            exports.albums = db.collection("albums")
            if (exports.albums == null) {cb(make_error(null, "Could not connect to album client"));}
            console.log("albums data type:", typeof(exports.albums));
            cb(null);
        },

       function (cb) {
       //     exports.albums = albums_coll;
         //   db.collection("photos", cb);
            console.log("app data db.js albums_coll");
            exports.photos = db.collection("photos")
            if (exports.photos == null) {cb(make_error(null, "Could not connect to photo client"))};
            cb(null);         
        },

        function (cb) {   // photos_coll
        //    exports.photos = photos_coll;
        //    db.collection("users", cb);
            console.log("app data db.js users_coll");
            exports.users = db.collection("users")
            if (exports.users == null) {cb(make_error(null, "Could not connect to users client"))};
            cb(null);     
        },

        // list all photos
        function (cb) { 
            console.log("Get the photo list.");
            exports.photos.find({ }).toArray()
                .then (data => cb(null, data))    // This will return an array of albums
                .catch (err => cb(make_error(err, "Error 67 listing albums")));       
        },

        // print the photo list
        function (all_photos, cb) {
            console.log("  Num photos:", all_photos.length);
            // all_albums.forEach(doc => console.log(doc));
            cb(null);
        },

        // list all users
        function (cb) { 
            console.log("Get the user list.");
            exports.users.find({ }).toArray()
                .then (data => cb(null, data))    // This will return an array of albums
                .catch (err => cb(make_error(err, "Error 67 listing albums")));       
        },        

        // print the user list
        function (all_users, cb) {
            console.log("  Num users:", all_users.length);
           // all_users.forEach(doc => console.log(doc));
            cb(null);
        },        

    ], callback);
};


exports.albums = null;
exports.photos = null;
exports.users = null;

// To create a personal error
function make_error(err, msg) {
	//console.log("Make error msg:", msg);
  //console.log("Passed error msg:", err);
    var e = new Error(msg);
    e.code = msg;
    return e;
}  