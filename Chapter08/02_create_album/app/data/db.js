// Fixed issues with db opening 

// var MongoClient = require('mongodb').MongoClient,
const { MongoClient } = require('mongodb'),
    async = require('async'),
    local = require("../local.config.json");

/**
 * We'll keep this private and not share it with anybody.
 */
var db;
var client; //added

/**
 * Currently for initialisation, we just want to open
 * the database.  We won't even attempt to start up
 * if this fails, as it's pretty pointless.
 */
exports.init = function (callback) {
    async.waterfall([
        // 1. open database connection
        function (cb) {
            var url = local.config.db_config.host_url;
            console.log("`\n** 1. open db ", url);
        /*    MongoClient.connect(url, (err, dbase) => {
                if (err) return cb(err);
                console.log("**    Connected to server");
                db = dbase;
                cb(null);
            });*/
            MongoClient.connect(url)  
                .then(retclient => {client = retclient; cb(null)})
                .catch(err => make_error(err, "Could not connect to MongoDB server"));
        },

        // 2. create collections for our albums and photos. if
        //    they already exist, then we're good.
        function (cb) {
            console.log("** 2. create albums and photos collections.");
            var dbName = local.config.db_config.db_name;
            db = client.db(dbName);  // new
            if (db == null) {cb(make_error(null, "Could not connect to client server"));} // new
    
            // db.collection("albums", cb);
            exports.albums = db.collection("albums")
            if (exports.albums == null) {cb(make_error(null, "Could not connect to album client"));}
            console.log("albums data type:", typeof(exports.albums));
            cb(null);
        },

        // function (albums_coll, cb) {
        function (cb) {
            console.log("app data db.js albums_coll");
            // What albums did we find 
            // exports.albums = albums_coll;
            // db.collection("photos", cb);
            exports.photos = db.collection("photos")
            if (exports.photos == null) {cb(make_error(null, "Could not connect to photo client"))};
            cb(null);
        },

        // list all albums
        function (cb) { 
            console.log("5. get the album list.");
            exports.albums.find({ }).toArray()
                .then (data => cb(null, data))    // This will return an array of albums
                .catch (err => cb(make_error(err, "Error 67 listing albums")));       
        },

        // print the album list
        function (all_albums, cb) {
            console.log("  Num albums:", all_albums.length);
            // all_albums.forEach(doc => console.log(doc));
            cb(null);
        },

        // list all photos
        function (cb) { 
            console.log("5. get the photo list.");
            exports.photos.find({ }).toArray()
                .then (data => cb(null, data))    // This will return an array of albums
                .catch (err => cb(make_error(err, "Error 67 listing albums")));       
        },

        // print the album list
        function (all_photos, cb) {
            console.log("  Num photos:", all_photos.length);
            // all_albums.forEach(doc => console.log(doc));
            cb(null);
        }

        /*
        function (photos_coll, cb) {
            exports.photos = photos_coll;
            cb(null);
        }*/
    ], callback);
};


exports.albums = null;
exports.photos = null;


