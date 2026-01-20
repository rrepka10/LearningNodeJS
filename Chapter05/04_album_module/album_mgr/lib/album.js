// This contains helper functions for our albums library

var path = require('path'),
    fs = require('fs');

// Define an album object
function Album (album_path) {
    this.name = path.basename(album_path);
    this.path = album_path;
}

// Set default values
// Use prototype to set properties on all instances
Album.prototype.name = null;
Album.prototype.path = null;
Album.prototype._photos = null;

// Use prototype to set properties on all instances
Album.prototype.photos = function (callback) {
    if (this._photos != null) {
        callback(null, this._photos);
        return;
    }

    // fs.readdir(path, options, callback(err, filedata))
    fs.readdir(this.path, (err, files) => {
        if (err) {
            if (err.code == "ENOENT") {
                // Invalid album/directory name
                callback(no_such_album());
            } else {
                // Some other dir error, format the error and pass it back
                callback(make_error("file_error", JSON.stringify(err)));
            }
            return;
        }

        // Used to track the individual files
        var only_files = [];
        
        var iterator = (index) => {
            // Are we done
            if (index == files.length) {
                // All done, return the data
                callback(null, only_files);
                return;
            }

            // Not done, do the next entry 
            // fs.stat(path, callback) - get file info
            // The files array is fully defined at this point 
            fs.stat(this.path + "/" + files[index], (err, stats) => {
                if (err) {
                    // Format the error and pass it back
                    callback(make_error("file_error",
                                        JSON.stringify(err)));
                    return;
                }
                if (stats.isFile()) {
                    // Add the file to the list
                    only_files.push(files[index]);
                }
                // use recursion, re-call the function with the next index
                iterator(index + 1)
            });
        };

        // Start the recursion
        iterator(0);
    });
};

// Function to create the album objet
exports.create_album = function (path) {
    return new Album(path);
};

// Build an error object
function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

// Error function to report an invalid album name

function no_such_album() {
    return make_error("no_such_album",
                      "The specified album does not exist");
}
