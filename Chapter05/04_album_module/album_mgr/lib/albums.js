// The base of the album manger library

var fs = require('fs'), 
    album = require('./album.js');

// alwasy export a version and keep it yo to date
exports.version = "1.0.0";



exports.albums = function (root, callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    // fs.readdir(path, options, callback(err, filedata)
    fs.readdir(root + "/albums", (err, files) => {
        if (err) {
            // Some problem
            callback(err);
            return;
        }

        // Used to track the albums (directories)
        var album_list = [];

        (function iterator(index) {
            if (index == files.length) {
                // All done, return the data
                callback(null, album_list);
                return;
            }

            fs.stat(root + "albums/" + files[index], (err, stats) => {
                if (err) {
                    // Format the error and pass it back
                    callback(make_error("file_error",
                                        JSON.stringify(err)));
                    return;
                }

                // Check that the stat call back is a directory
                if (stats.isDirectory()) {
                    var p = root + "albums/" + files[index];

                    // This is an album/directory, add the name to the list 
                    album_list.push(album.create_album(p));
                }

                // use recursion, re-call the function with the next index
                iterator(index + 1)
            });
        })(0);
    });
};

// Build an error object
function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

