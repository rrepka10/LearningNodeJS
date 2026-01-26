// Module to handle albums

var helpers = require('./helpers.js'),
    async = require('async'),
    fs = require('fs');

exports.version = "0.1.0";

// Make available as a module function
exports.list_all = function (req, res) {
    console.log("List all");
    load_album_list(function (err, albums) {
        if (err) {
            helpers.send_failure(res, 500, err);
            return;
        }

        helpers.send_success(res, { albums: albums });
    });
};

// Make available as a module function
exports.album_by_name = function (req, res) {
    console.log("Album by name");
    // get the GET params
    var getp = req.query;
    var page_num = getp.page ? getp.page : 0;
    var page_size = getp.page_size ? getp.page_size : 1000;

    if (isNaN(parseInt(page_num))) page_num = 0;
    if (isNaN(parseInt(page_size))) page_size = 1000;

    // format of request is /albums/album_name.json
    var album_name = req.params.album_name;
    load_album(
        album_name,
        page_num,
        page_size,
        function (err, album_contents) {
            if (err && err.error == "no_such_album") {
                helpers.send_failure(res, 404, err);
            }  else if (err) {
                helpers.send_failure(res, 500, err);
            } else {
                helpers.send_success(res, { album_data: album_contents });
            }
        }
    );
};



// provides the directory list of everything in the directory
// http://localhost:8080/albums.json
function load_album_list(callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    console.log("Load album list");
    fs.readdir(
        "albums",
        function (err, files) {
            if (err) {
                // Pass and error back
                callback(helpers.make_error("file_error", JSON.stringify(err)));
                return;
            }

            // Variable to store the albums
            var only_dirs = [];

            // Async forces each to finish before continuing 
            async.forEach(
                files,
                function (element, cb) {
                    fs.stat(
                        "albums/" + element,
                        function (err, stats) {
                            if (err) {
                                // Return an error
                                cb(helpers.make_error("file_error",
                                                      JSON.stringify(err)));
                                return;
                            }

                            // Add the file name only if it is a directory
                            if (stats.isDirectory()) {
                                only_dirs.push({ name: element });
                            }

                            // Send no error back
                            cb(null);
                        }                    
                    );
                },

                // Some other error 
                function (err) {
                    callback(err, err ? null : only_dirs);
                }
            );
        }
    );
};


// This loads the files in an album
// http://localhost:8080/albums/japan2010.json
function load_album(album_name, page, page_size, callback) {
    console.log("Load album");
    fs.readdir(
        "albums/" + album_name,
        function (err, files) {
            if (err) {
                if (err.code == "ENOENT") {
                    // No such file
                    callback(helpers.no_such_album());
                } else {
                    // Some other error
                    callback(helpers.make_error("file_error",
                                                JSON.stringify(err)));
                }
                return;
            }

            var only_files = [];
            var path = "albums/" + album_name + "/";

            // Async forces each to finish before continuing 
            async.forEach(
                files,
                function (element, cb) {
                    fs.stat(
                        path + element,
                        function (err, stats) {
                            if (err) {
                                // error 
                                cb(helpers.make_error("file_error",
                                                      JSON.stringify(err)));
                                return;
                            }
                            if (stats.isFile()) {
                                // Found a file, build a file object
                                var obj = { filename: element,
                                            desc: element };
                                // Add it to the list
                                only_files.push(obj);
                            }

                            // Send no error back
                            cb(null);
                        }                    
                    );
                },

                function (err) {
                    if (err) {
                        // error
                        callback(err);
                    } else {
                        // Handle paging 
                        var ps = page_size;
                        var photos = only_files.slice(page * ps, ps);
                        var obj = { short_name: album_name,
                                    photos: photos };
                        // Send back the requestd page
                        callback(null, obj);
                    }
                }
            );
        }
    );
};

