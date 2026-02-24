// Fixed issues with db callback handling

var fs = require('fs'),
    crypto = require("crypto"),
    local = require('../local.config.json'),
    db = require('./db.js'),
    path = require("path"),
    async = require('async'),
    backhelp = require("./backend_helpers.js");

exports.version = "0.1.0";


exports.create_album = function (data, callback) {
    var final_album;
    var write_succeeded = false;
    console.log("app data album.js create_album");
    async.waterfall([
        // validate data.
        function (cb) {
            try {
                backhelp.verify(data,
                                [ "name",
                                  "title",
                                  "date",
                                  "description" ]);
                if (!backhelp.valid_filename(data.name))
                    throw invalid_album_name();
            } catch (e) {
                cb(e);
                return;
            }
            cb(null, data);
        },

        // create the album in mongo.
        function (album_data, cb) {
			// Clone album_data so we can add a new Element
			// without changing the original 
            var write = JSON.parse(JSON.stringify(album_data));
            write._id = album_data.name;
			console.log("app data album.js albums.insertOne");
            db.albums.insertOne(write, { w: 1, safe: true }, cb);
        },

        // make sure the folder exists in our static folder.
        function (results, cb) {
            write_succeeded = true;
            final_album = results.ops[0];
            fs.mkdir(local.config.static_content
                     + "albums/" + data.name, cb);
        }
    ], 

    function (err, results) {
        // convert file errors to something we like.
        if (err) {
            if (write_succeeded)
				console.log("app data album.js albums.deleteOne");
                db.albums.deleteOne({ _id: data.name }, function () {});

            if (err instanceof Error && err.code == 11000) 
                callback(backhelp.album_already_exists());
            else if (err instanceof Error && err.errno != undefined)
                callback(backhelp.file_error(err));
            else
                callback(err);
        } else {
            callback(err, err ? null : final_album);
        }
    }); 
};


exports.album_by_name = function (name, callback) {
    console.log("app data album.js album_by_name", name);
    /*
    db.albums.find({ _id: name }).toArray((err, results) => {
        if (err) {
            console.log("  could not find album", name);
            callback(err);
            return;
        }*/
    db.albums.find({ _id: name }).toArray()
        .then (results => {        	
            console.log("  album found, num", results.lenght);
            if (results.length == 0) {
                callback(null, null);
            } else if (results.length == 1) {
                callback(null, results[0]);
            } else {
                console.error("More than one album named: " + name);
                console.error(results);
                callback(backhelp.db_error());
            }
        })
        .catch (err => {
            console.log("  could not find album", name);
            callback(err);
            return;
            })
};


exports.photos_for_album = function (album_name, pn, ps, callback) {
    var sort = { date: -1 };
	console.log("app data album.js photos_for_album", album_name);
    db.photos.find({ albumid: album_name }).toArray()
      .then (data => console.log(album_name, "photos found", data))
      .catch (err => callback(err)); 

    db.photos.find({ albumid: album_name })
            .skip(pn)
            .limit(ps)
            .sort({ date: 1})
            .toArray()
        .then (data => callback(null, data))
        .catch (err => callback(err)); 
};



// Return an array of albums
exports.all_albums = function (sort_field, sort_desc, skip, count, callback) {
    var sort = {};
	console.log("app data album.js all_albums");
    sort[sort_field] = sort_desc ? -1 : 1;
    db.albums.find({  })
        .sort(sort)
        .limit(count)
        .skip(skip)
        .toArray()
      .then (data => {console.log("Albums found", data), callback(null, data)})    // This will return an array of albums in the callback, 
      .catch (err => {console.log("  error: no albums found"); callback(err)}); 
  /*  db.albums.find({})
        .sort(sort)
        .limit(count)
        .skip(skip)
        .toArray(callback);*/
};



exports.add_photo = function (photo_data, path_to_photo, callback) {
    var final_photo;
    var base_fn = path.basename(path_to_photo).toLowerCase();
	console.log("app data album.js add_photo");
    async.waterfall([
        // validate data
        function (cb) {
            try {
                backhelp.verify(photo_data,
                                [ "albumid",
                                  "description",
                                  "date" ]);

                photo_data.filename = base_fn;

                if (!backhelp.valid_filename(photo_data.albumid))
                    throw invalid_album_name();
            } catch (e) {
                cb(e);
                return;
            }

            cb(null, photo_data);
        },

        // add the photo to the collection
        function (pd, cb) {
            pd._id = pd.albumid + "_" + pd.filename;
            db.photos.insertOne(pd, { w: 1, safe: true }, cb);
        },

        // now copy the temp file to static content
        function (results, cb) {
            final_photo = results.ops[0];

            var save_path = local.config.static_content + "albums/"
                + photo_data.albumid + "/" + base_fn;

            backhelp.file_copy(path_to_photo, save_path, true, cb);
        }
    ],
    function (err, results) {
        // convert file errors to something we like.
        if (err && err instanceof Error && err.errno != undefined)
            callback(backhelp.file_error(err));
        else
            callback(err, err ? null : final_photo);
    }); 

};



function invalid_album_name() {
    return backhelp.error("invalid_album_name",
                          "Album names can have letters, #s, _ and, -");
}
function invalid_filename() {
    return backhelp.error("invalid_filename",
                          "Filenames can have letters, #s, _ and, -");
}

