// This populates the mongo data base 

// npm install async
// npm install mongodb

const { MongoClient } = require('mongodb');
const async = require('async');

// Connection URL
var url = 'mongodb://localhost:27017';

const dbName = 'photosharingapp';
const albumcoll = 'albums';
const photocoll = 'photos';
const userscoll = 'users';

var db, client;
var albums, photos, users;



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
    console.log("This creates the data base entries for the 03_with_user_auth apps.");
    console.log("The albums, photos and user clients must be empty on the DB server");
       
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
    users = db.collection(userscoll)
      if (users == null) {cb(make_error(null, "Could not connect to users client"))};
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
            { filename: "picture_005.jpg",
              albumid: "japan2010",
              description: "something nice",
              date: "2010/06/14 12:21:40" },
            { filename: "picture_001.jpg",
              albumid: "japan2010",
              description: "tokyo tower!",
              date: "2010/06/11 12:20:40" },
            { filename: "picture_006.jpg",
              albumid: "japan2010",
              description: "kitty cats",
              date: "2010/06/14 12:23:40" },
            { filename: "picture_003.jpg",
              albumid: "japan2010",
              description: "shinjuku is nice",
              date: "2010/06/12 08:30:40" },
            { filename: "picture_004.jpg",
              albumid: "japan2010",
              description: "eating sushi",
              date: "2010/06/12 08:34:40" },
            { filename: "picture_002.jpg",
              albumid: "japan2010",
              description: "roppongi!",
              date: "2010/06/12 07:44:40" },
            { filename: "picture_007.jpg",
              albumid: "japan2010",
              description: "moo cow oink pig woo!!",
              date: "2010/06/15 12:55:40" },
            { filename: "aus_01.jpg",
              albumid: "australia2010",
              description: "sydney!",
              date: "2010/10/20 07:44:40" },
            { filename: "aus_02.jpg",
              albumid: "australia2010",
              description: "asdfasdf!",
              date: "2010/10/20 08:24:40" },
            { filename: "aus_03.jpg",
              albumid: "australia2010",
              description: "qwerqwr!",
              date: "2010/10/20 08:55:40" },
            { filename: "aus_04.jpg",
              albumid: "australia2010",
              description: "zzzxcv zxcv",
              date: "2010/10/21 14:29:40" },
            { filename: "aus_05.jpg",
              albumid: "australia2010",
              description: "ipuoip",
              date: "2010/10/22 19:08:40" },
            { filename: "aus_06.jpg",
              albumid: "australia2010",
              description: "asdufio",
              date: "2010/10/22 22:15:40" },
              { filename: "aus_07.jpg",
              albumid: "australia2010",
              description: "auhtdefio",
              date: "2010/11/22 22:15:40" },
              { filename: "aus_08.jpg",
              albumid: "australia2010",
              description: "asggfio",
              date: "2010/10/22 22:05:40" },
              { filename: "aus_09.jpg",
              albumid: "australia2010",
              description: "asdasdio",
              date: "2010/10/22 22:25:40" }
        ];

  console.log("4. Add photos.");
  photos.insertMany(pix)
    .then(result => cb(null))
    .catch(err => cb(make_error(err, "Error 207 inserting photos")));
  },

  // let's add some users now
  function (cb) {
    var docs = [{ _id: "rrepka10@gmail.com",
                  userid: "rrepka10",
                  email_address:"rrepka10@gmail.com",
                  display_name:"Richard Repka",
                  password: "hash1",
                  first_seen_date: "123456", //now_in_s(),
                  last_modified_date: "123456", //now_in_s(),
                  deleted: false
                },
                { _id:"rrepka10@yahoo.com",
                  userid: "rrepka",
                  email_address:"rrepka10@yahoo.com",
                  display_name:"Richard R",
                  password: "hash2",
                  first_seen_date: "123456", //now_in_s(),
                  last_modified_date: "123456", //now_in_s(),
                  deleted: false
                }];

  console.log("5. Create users.");
  users.insertMany(docs)
    .then(result => cb(null))
    .catch(err => cb(make_error(err, "Error inserting users ")));
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
