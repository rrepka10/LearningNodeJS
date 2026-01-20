// Web service to return a directory listing using recursion to filter
// the results to directories only.
// test: browser http://localhost:8080/albums.json
//               http://localhost:8080/albums/italy2012.json
// This now returns subdirectories for files in a subdirectory

var http = require('http'),
    fs = require('fs');

// provides the directory list of everything in the directory
function load_album_list(callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    // fs.readdir(path, options, callback(err, filedata))
    fs.readdir("albums", (err, files) => {
        if (err) {
            // Format the error and pass it back
            callback(make_error("file_error",  JSON.stringify(err)));
            return;
        }

        // Used to track the directories
        var only_dirs = [];

        // Define the recursive iterator function, passing an index value
        var riterator = (index) => {
            // 'files' was passed in the call back,
            // only process the length of the array
            // console.log("files.length:", files ,files.length);
            if (index == files.length) {
                // All done, return the data
                callback(null, only_dirs);
                return;
            }

            // Not done, do the next entry 
            // fs.stat(path, callback) - get file info
            // The files array is fully defined at this point 
            fs.stat("albums/" + files[index], (err, stats) => {
                if (err) {
                    // Format the error and pass it back
                    callback(make_error("file_error",
                                        JSON.stringify(err)));
                    return;
                }

                // Check that the stat call back is a directory
                if (stats.isDirectory()) {
                    // create JSON return data
                    var obj = { name: files[index] };
                    // This is a directory, add the name to the directory variable
                    only_dirs.push(obj);
                }

                // use recursion, re-call the function with the next index
                riterator(index + 1)
            });

        }

        // Start the recursion
        riterator(0);
    });
}

// provides the directory list for a specific album
function load_album(album_name, callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    // fs.readdir(path, options, callback(err, filedata))
    fs.readdir("albums/" + album_name, (err, files) => {
        if (err) {
            if (err.code == "ENOENT") {
                // Invalid album/directory name
                callback(no_such_album());
            } else {
                // Some other dir error, format the error and pass it back
                callback(make_error("file_error",
                                    JSON.stringify(err)));
            }
            return;
        }

        // Used to track the individual files
        var only_files = [];

        // Put the album name in the request 
        var path = `albums/${album_name}/`;

        // 'files' was passed in the call back,
        // only process the length of the array
        // console.log("files.length:", files ,files.length);
        var riterator = (index) => {
            // Are we done
            if (index == files.length) {
                // All done, build a json object
                var obj = { short_name: album_name,
                            photos: only_files };
                callback(null, obj);
                return;
            }

            // Not done, do the next entry 
            // fs.stat(path, callback) - get file info
            // The files array is fully defined at this point 
            fs.stat(path + files[index], (err, stats) => {
                if (err) {
                    // Format the error and pass it back
                    callback(make_error("file_error",
                                        JSON.stringify(err)));
                    return;
                }
                if (stats.isFile()) {
                    // Build a json object with the file info
                    var obj = { filename: files[index],
                                desc: files[index] };
                    // Add the data to our array
                    only_files.push(obj);
                }
                // use recursion, re-call the function with the next index
                riterator(index + 1)
            });
        }
        // Start the recursion
        riterator(0);
    });
}

// provides the directory list of everything in the directory
function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);

    // We can have different requests now
    if (req.url == '/albums.json') {
        // Generic "get all"
        handle_list_albums(req, res);
    } else if (req.url.substr(0, 7) == '/albums'
               && req.url.substr(req.url.length - 5) == '.json') {
        // get a specific alubm
        handle_get_album(req, res);
    } else {
        // Invalid request
        send_failure(res, 404, invalid_resource());
    }
}

// provides the generic list 
function handle_list_albums(req, res) {
    load_album_list((err, albums) => {
        if (err) {
            // Return a 500 error to the browser
            send_failure(res, 500, err);
            return;
        }

        // Success, provide the specific files
        send_success(res, { albums: albums });
    });
}

// provides the file list for a specifc directory
function handle_get_album(req, res) {
    // format of request is /albums/album_name.json
    var album_name = req.url.substr(7, req.url.length - 12);

    load_album(album_name, (err, album_contents) => {
        if (err && err.error == "no_such_album") {
            send_failure(res, 404, err);
        }  else if (err) {
            send_failure(res, 500, err);
        } else {
            send_success(res, { album_data: album_contents });
        }
    });
}


// Build an error object
function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}

// return the success html
function send_success(res, data) {
    res.writeHead(200, {"Content-Type": "application/json"});
    var output = { error: null, data: data };
    res.end(JSON.stringify(output) + "\n");
}

// return the failure html
function send_failure(res, server_code, err) {
    var code = (err.code) ? err.code : err.name;
    res.writeHead(server_code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}


// Sent when a wrong folder is selected 
function invalid_resource() {
    return make_error("invalid_resource",
                      "the requested resource does not exist.");
}

// Error function to report an invalid album name
function no_such_album() {
    return make_error("no_such_album",
                      "The specified album does not exist");
}

// Create a server on port 8080 using "handle_incoming_request"
var s = http.createServer(handle_incoming_request);
s.listen(8080);

