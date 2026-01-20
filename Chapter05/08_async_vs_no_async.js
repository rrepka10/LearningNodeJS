// This demonstrates a standard code fragment to load a files
// versys using a waterfall model.  The waterfall model takes
// an array of functions to run.  The results are passed 
// from one function to the next


// npm install --save async

var fs = require('fs');
var async = require('async');

// Typical call back model, note the indent levels
function load_file_contents(path, callback) {
    // Try to open the file
    fs.open(path, 'r', (err, f) => {
        if (err) {
            //error 
            callback(err);
            return;
        } else if (!f) {
            // error
            callback(make_error("invalid_handle",
                                "bad file handle from fs.open"));
            return;
        }

        // file statistics
        fs.fstat(f, (err, stats) => {
            if (err) {
                // error
                callback(err);
                return;
            }

            // File?
            if (stats.isFile()) {
                //var b = new Buffer(stats.size);
                var b = Buffer.alloc(stats.size);

                // Read the data
                fs.read(f, b, 0, stats.size, null, (err, br, buf) => {
                    if (err) {
                        // error
                        callback(err);
                        return;
                    }

                    // Close the file
                    fs.close(f, (err) => {
                        if (err) {
                            // error
                            callback(err);
                            return;
                        }
                        // return the data
                        callback(null, b.toString('utf8', 0, br));
                    });
                });
            } else {
                // error
                calback(make_error("not_file", "Can't load directory"));
                return;
            }
        });
    });
}

// Use a waterfall function to read files 
// note, no indent
function load_file_contents2(path, callback) {
    var f;
    // Pass an array of functions to call
    async.waterfall([
        function (cb) {             // cb stands for "callback"
            fs.open(path, 'r', cb);
        },

        // the handle was passed to the callback at the end of
        // the fs.open function call. async passes ALL params to us.
        function (handle, cb) {
            f = handle
            fs.fstat(f, cb);
        },

        // get the file type
        function (stats, cb) {
            //var b = new Buffer(stats.size);
            var b = Buffer.alloc(stats.size);

            if (stats.isFile()) {
                // yes a file, read it
                fs.read(f, b, 0, stats.size, null, cb);
            } else {
                // error
                calback(make_error("not_file", "Can't load directory"));
            }
        },

        //
        function (bytes_read, buffer, cb) {
            fs.close(f, function (err) {
                if (err)
                    cb(err);
                else
                    cb(null, buffer.toString('utf8', 0, bytes_read));
            })
        }
    ],

    // called after all fns have finished, or then there is an error.
    function (err, file_contents) {
        callback(err, file_contents);
    });
}



load_file_contents(
    "test.txt", 
    function (err, contents) {
        if (err)
            console.log("normal load:", err);
        else
            console.log("normal load:", contents);
    }
);

load_file_contents2(
    "test.txt", 
    function (err, contents) {
        if (err)
            console.log("Waterfall load:",err);
        else
            console.log("Waterfall load:", contents);
    }
);

function make_error(err, msg) {
    var e = new Error(msg);
    e.code = msg;
    return e;
}

