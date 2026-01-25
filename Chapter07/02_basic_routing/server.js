// Basic express routing example

// Browser testing:

// npm install --save express
// npm install --save async

// http://localhost:8080/albums.json                        Displays the album JSON list
// http://localhost:8080/albums/italy2012.json              Displays the italy JSON image list
// http://localhost:8080/pages/home                         Displays a nice album menu
// http://localhost:8080/pages/album/japan2010                  Graphically displays all the album images
// http://localhost:8080/albums/japan2010/picture_001.jpg   Displays a specific image 


var express = require('express');

// Create the express app object
var app = express();

var path = require("path"),
    async = require('async'),
    fs = require('fs');

// Register for the albums.json url
// The router can handle wild card matching AND are executed in order
// e.g. /users(s)?/list - would match users/list OR user/lib
// The general form is: url, function(req, res), <optional next>); 
// http://localhost:8080/albums.json                        Displays the album JSON list
app.get('/albums.json', handle_list_albums);

// Register for a specific album name
// Using: :album_name as a place holder, e.g. extracts italy2012
// http://localhost:8080/albums/italy2012.json              Displays the italy JSON image list
app.get('/albums/:album_name.json', handle_get_album);

// Register for specific content
app.get('/content/:filename', function (req, res) {
    serve_static_file('content/' + req.params.filename, res);
});

// Register for a specific file in a specific album
// http://localhost:8080/albums/japan2010/picture_001.jpg   Displays a specific image 
app.get('/albums/:album_name/:filename', function (req, res) {
    serve_static_file('albums/' + req.params.album_name + "/"
                      + req.params.filename, res);
});

// Register for a specific template
app.get('/templates/:template_name', function (req, res) {
    serve_static_file("templates/" + req.params.template_name, res);
});

// Register for a specific album
// http://localhost:8080/pages/home                         Displays a nice album menu
// http://localhost:8080/pages/album/japan2010                  Graphically displays all the album images
app.get('/pages/:page_name', serve_page);
app.get('/pages/:page_name/:sub_page', serve_page);
app.get('*', four_oh_four);

// Send a 404 error 
function four_oh_four(req, res) {
    send_failure(res, 404, invalid_resource());
}

// Open the requested file and send it back 
function serve_static_file(file, res) {
    console.log("Serve static file:", file);

    // Open a stream to the requested file
    var rs = fs.createReadStream(file);

    // If ther is an error, create the html and send it back
    rs.on(
        'error',
        function (e) {
            res.writeHead(404, { "Content-Type" : "application/json" });
            var out = { error: "not_found",
                        message: "'" + file + "' not found" };
            res.end(JSON.stringify(out) + "\n");
            return;
        }
    );

    // get the content type html based on the file extension
    var ct = content_type_for_file(file);

    // Write the html header
    res.writeHead(200, { "Content-Type" : ct });

    // Use a pipe to send the data, no readable, pause, resume, end, etc
    rs.pipe(res);
}


// Returns the http type for select content types based on file extension
function content_type_for_file (file) {
    // Get the extension
    var ext = path.extname(file);

    switch (ext.toLowerCase()) {
        case '.html': return "text/html";
        case ".js": return "text/javascript";
        case ".css": return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jpeg';
        default: return 'text/plain';
    }
}

// provides the directory list of everything in the directory
// http://localhost:8080/albums.json
function load_album_list(callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    console.log("Load Album list");

    fs.readdir(
        "albums",
        function (err, files) {
            if (err) {
                // Pass and error back
                callback(make_error("file_error", JSON.stringify(err)));
                return;
            }

            // Variable to store the albums
            var only_dirs = [];

            // Async forces each to finish before continuing 
            async.forEach(
                files,
                function (element, cb) {
                    // Add the file name only if it is a directory
                    fs.stat(
                        "albums/" + element,
                        function (err, stats) {
                            if (err) {
                                // Return an error
                                cb(make_error("file_error", JSON.stringify(err)));
                                return;
                            }
                            if (stats.isDirectory()) {
                                // Add the directory to the file list
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
}

// This loads the files in an album
// http://localhost:8080/albums/japan2010.json
function load_album(album_name, page, page_size, callback) {
    fs.readdir(
        "albums/" + album_name,
        function (err, files) {
            if (err) {
                if (err.code == "ENOENT") {
                    // No such file
                    callback(no_such_album());
                } else {
                    // Some other error
                    callback(make_error("file_error", JSON.stringify(err)));
                }
                return;
            }

            var only_files = [];
            var path = "albums/" + album_name + "/";

            // Async forces each to finish before continueing 
            async.forEach(
                files,
                function (element, cb) {
                    fs.stat(
                        path + element,
                        function (err, stats) {
                            if (err) {
                                // error 
                                cb(make_error("file_error", JSON.stringify(err)));
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
                        // Some error
                        callback(err);
                    } else {
                        // Return "pages" at a time
                        var ps = page_size;
                        var photos = only_files.slice(page * ps, ps);
                        var obj = { short_name: album_name,
                                    photos: photos };
                        callback(null, obj);
                    }
                }
            );
        }
    );
}


/**
 * All pages come from the same one skeleton HTML file that
 * just changes the name of the JavaScript loader that needs to be
 * downloaded.
 */
function serve_page(req, res) {
    var page = get_page_name(req);
    console.log("Serve basic.html");

    // Read the skeleton HTML file to kick off the client side javascript
    fs.readFile(
        'basic.html',
        function (err, contents) {
            if (err) {
                send_failure(res, 500, err);
                return;
            }

            // Make it readable 
            contents = contents.toString('utf8');

            // replace page name, and then dump to output.
            contents = contents.replace('{{PAGE_NAME}}', page);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contents);
        }
    );
}


// Function to handle list albums
function handle_list_albums(req, res) {
    console.log("List albums");
    load_album_list(function (err, albums) {
        if (err) {
            send_failure(res, 500, err);
            return;
        }

        send_success(res, { albums: albums });
    });
}


// Function to handle get album
function handle_get_album(req, res) {
    console.log("Get Album");

    // get the GET params
    var getp = get_query_params(req);
    var page_num = getp.page ? getp.page : 0;
    var page_size = getp.page_size ? getp.page_size : 1000;

    console.log("album name:", album_name, "getp:", getp, "page num:", page_num, "page_size:", page_size);

    if (isNaN(parseInt(page_num))) page_num = 0;
    if (isNaN(parseInt(page_size))) page_size = 1000;

    // format of request is /albums/album_name.json
    var album_name = get_album_name(req);
    load_album(
        album_name,
        page_num,
        page_size,
        function (err, album_contents) {
            if (err && err == "no_such_album") {
                send_failure(res, 404, err);
            }  else if (err) {
                send_failure(res, 500, err);
            } else {
                send_success(res, { album_data: album_contents });
            }
        }
    );
}



// General helper functions
function make_error(err, msg) {
    var e = new Error(msg);
    e.code = err;
    return e;
}


function send_success(res, data) {
    res.writeHead(200, {"Content-Type": "application/json"});
    var output = { error: null, data: data };
    res.end(JSON.stringify(output) + "\n");
}


function send_failure(res, server_code, err) {
    var code = (err.code) ? err.code : err.name;
    res.writeHead(server_code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}


function invalid_resource() {
    return make_error("invalid_resource",
                      "the requested resource does not exist.");
}

function no_such_album() {
    return make_error("no_such_album",
                      "The specified album does not exist");
}


function get_album_name(req) {
    return req.params.album_name;
}
function get_template_name(req) {
    return req.params.template_name;
}
function get_query_params(req) {
    return req.query;
}
function get_page_name(req) {
    return req.params.page_name;
}

// Now use app.listen NOT http.listen
app.listen(8080);
