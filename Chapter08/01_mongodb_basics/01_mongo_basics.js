// This demonstratest basic MongoDB operations
// This fully replaces the book 01_mongo_basics.js as it doesn't run
// Install the Mongodb.com Compass Community edition as a service

// create a DB called: photosharingapp and with collection names of: albums and photos

// hangs on connect operation

// npm install async
// npm install mongodb

const { MongoClient } = require('mongodb');
const async = require('async');
const mongoose = require('mongoose');

// Connection URL
var url = 'mongodb://localhost:27017';

const dbName = 'photosharingapp';
const albumcoll = 'albums';
const photocoll = 'photos';

var db, client;
var albums, photos;

/*
// Set debug mode
mongoose.set('debug', function (collectionName, method, query, doc, options) {
  //const ts = new Date().toISOString();
  
  //console.log(`[${ts}] Mongoose ${collectionName}.${method}`, {
    console.log(`Mongoose ${collectionName}.${method}`, {
	method,
    query,
    doc,
    options
  });
});
 */


/**
 * Don't forget that for waterfall, it will stop and call the final
 * "cleanup" function whenever it sees an error has been passed to 
 * one of the callback functions.
 *
 * Also, if a parameter is given to the callback, it will include
 * those in the next function called in the waterfall.
 */
async.waterfall([
  function (cb) {
    console.log("1. Connect - note: All album and photos clients \n  must be empty on the DB server");
       
    // Use connect method to connect to the Server
    MongoClient.connect(url)  
      .then(retclient => {client = retclient; cb(null)})
      .catch(err => make_error(err, "Could not connect to MongoDB server"));
  },

  // Get DB + collection
  function getCollection(cb) {
    console.log(`2 Getting ${dbName} DB and ${albumcoll} & ${photocoll} client`);
    db = client.db(dbName);
      if (db == null) {cb(make_error(null, "Could not connect to client server"));}
    albums = db.collection(albumcoll)
      if (albums == null) {cb(make_error(null, "Could not connect to album client"));}
    photos = db.collection(photocoll)
      if (photos == null) {cb(make_error(null, "Could not connect to photo client"))};
    cb(null);
  },

  // let's add some albums now
  function (cb) {
    var docs = [{ _id: "italy2012",
                  name:"italy2012",
                  title:"Spring Festival in Italy",
                  date:"2012/02/15",
                  description:"I went to Italy for Spring Festival."
                },
                { _id:"australia2010",
                  name:"australia2010",
                  title:"Vacation Down Under",
                  date:"2010/10/20",
                  description:"Visiting some friends in Oz!"
                },
                { _id:"japan2010",
                  name:"japan2010",
                  title:"Programming in Tokyo",
                  date:"2010/06/10",
                  description:"I worked in Tokyo for a while."
                }];

  console.log("3. Create albums.");
  albums.insertMany(docs)
    .then(result => cb(null))
    .catch(err => cb(make_error(err, "Error inserting albums")));
  },


  // let's add some photos 
  function (cb) {
    var pix = [
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
              date: "2010/06/12 08:30:40" },
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

  console.log("4. Add photos.");
  photos.insertMany(pix)
    .then(result => cb(null))
    .catch(err => cb(make_error(err, "Error 207 inserting photos")));
  },


  // list all albums
  function (cb) { 
    console.log("5. get the album list.");
    albums.find().toArray()
      .then (data => cb(null, data))    // This will return an array of albums
      .catch (err => cb(make_error(err, "Error 214 listing albums")));       
  },

  // print the album list
  function (all_albums, cb) {
    console.log("  Display the albums:", all_albums.length);
    all_albums.forEach(doc => console.log(doc));
    cb(null);
  },
      
  // find the italy2012 album in the photo list.
  function (cb) {
    console.log("6. Find italy2012 in the photo list.");
    photos.find({ albumid: "italy2012" })
            .sort({ date: 1 })
            .limit(5)
            .skip(2)
            .toArray()
      .then (data => cb(null, data))    // This will return an array of albums in the callback, 
      .catch (err => cb(make_error(err, "Error 229 finding italy"))); 
  },

  // print the italy picture list
  function (italy_photos, cb) {
    console.log("  Display the albums:", italy_photos.length);
    for (var i = 0; i < italy_photos.length; i++) {
      console.log("  Album: " + italy_photos[i].filename
                        + " (" + italy_photos[i].date + ")");
      }
    cb(null);
  },


  // replace the description in a photo
  function (cb) {
    console.log("7. update photo_03.jpgphoto.");
    photos.updateOne({ filename: "photo_03.jpg", albumid: "japan2010" },
                      { $set: { description: "NO SHINJUKU! BAD!" } },
                      { safe: true })
      .then (data => cb(null))    
      .catch (err => cb(make_error(err, "Error updating photo_03.jpg")));       
    },
    
  // delete a photo
  function (cb) {
    console.log("8. delete photo.");
    photos.deleteOne({ filename: "photo_04.jpg", albumid: "japan2010" },
                { safe: true })
      .then (data => { console.log("   Deleted " + data.deletedCount + " photos.");
        cb(null)}) 
      .catch (err => cb(make_error(err, "Error deleting photo_04.jpg")));
    },

    // delete an entire album and its photos.
    // delete album object.
    function (cb) {
      console.log("9. Delete entire australia2010 album.");
      albums.deleteOne({ _id: "australia2010"}, { safe: true },)
        .then (data => { console.log("   Deleted " + data.deletedCount + " albums.");
        cb(null)}) 
      .catch (err => cb(make_error(err, "Error deleting australia2010 album")));
    },

    // delete the photos in it.
    function (cb) { 
      photos.deleteMany({ albumid: "australia2010" }, { safe: true })
        .then (data => { console.log("   Deleted " + data.deletedCount + " photos.");
        cb(null)}) 
        .catch (err => cb(make_error(err, "Error deleting all australia2010 photos")));                    
    },

    // ask for an album that doesn't exist.
    function (cb) {
      console.log("10. Search for non-existant album.");
      albums.find({ _id: "france2014" }).toArray()
        .then (data => {console.log("  " + data.length + " francs2014 albums found");
          cb(null)})
        .catch (err => cb(make_error(err, "Bad return from find france2014 album")));
    },

  function (cb) {
    console.log("11 Tests complete, removing albums and photos");
    photos.deleteMany({ }, { safe: true })
      .then (data => {console.log("   Deleted " + data.deletedCount + " photos."); 
        cb(null)}) 
      .catch (err => cb(make_error(err, "Error deleting all photos")));
  },

   function (cb) {
    albums.deleteMany({}, { safe: true })
        .then (data => {console.log("   Deleted " + data.deletedCount + " albums.");
        cb(null)}) 
        .catch (err => cb(make_error(err, "Error deleting all albums")));
  }
],

// waterfall cleanup function
function (err, results) {
    if (err) {
        console.log("There was an error: ", err);
    } else {
        console.log("All operations completed.\n");
    }

    client.close();
});

// To create a personal error
function make_error(err, msg) {
	//console.log("Make error msg:", msg);
  //console.log("Passed error msg:", err);
    var e = new Error(msg);
    e.code = msg;
    return e;
}  
