// This demonstrated using Mustache to build a client/server website 

// Browser Tests:
// http://localhost:8080/albums.json                    Displays the album JSON list
// http://localhost:8080/albums/italy2012.json          Displays the italy JSON image list
// http://localhost:8080/pages/home                     Displays a nice album menu

// http://localhost:8080/pages/album/japan      Should graphically display the image 
// http://localhost:8080/albums/japan2010/picture_001.jpg

// npm install --save mustache


var http = require('http'),
    async = require('async'),
    path = require("path"),
    fs = require('fs'),
    url = require('url');

// Open the requested file and send it back 
function serve_static_file(file, res) {
    console.log("Serve static file:", file);

    // Open a stream to the requested file
    var rs = fs.createReadStream(file);

    // If ther is an error, create the html and send it back
    rs.on('error', (e) => {
        res.writeHead(404, { "Content-Type" : "application/json" });
        var out = { error: "not_found",
                    message: "'" + file + "' not found" };
        res.end(JSON.stringify(out) + "\n");
        return;
    });

    // get the content type html based on the file extension
    var ct = content_type_for_file(file);
    console.log("Content type:", ct);

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
    fs.readdir("albums", (err, files) => {
        if (err) {
            // Pass and error back
            callback({ error: "file_error",
                       message: JSON.stringify(err) });
            return;
        }

        // Variable to store the albums
        var only_dirs = [];

        // Async forces each to finish before continuing 
        async.forEach(files, (element, cb) => {
            // fs.stat(path, callback)
            fs.stat("albums/" + element, (err, stats) => {
                if (err) {
                    // Return an error
                    cb({ error: "file_error",
                         message: JSON.stringify(err) });
                    return;
                }

                // Add the file name only if it is a directory
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
        (err) => {
            callback(err, err ? null : only_dirs);
        });
    });
}

// This loads the files in an album
// http://localhost:8080/albums/japan2010.json
function load_album(album_name, page, page_size, callback) {
    console.log("Load Album");
    fs.readdir("albums/" + album_name, (err, files) => {
        if (err) {
            if (err.code == "ENOENT") {
                // No such file
                callback(no_such_album());
            } else {
                // Some other error
                callback({ error: "file_error",
                           message: JSON.stringify(err) });
            }
            return;
        }

        var only_files = [];
        var path = "albums/" + album_name + "/";

        // Async forces each to finish before continuing 
        async.forEach(files, (element, cb) => {

            fs.stat(path + element, (err, stats) => {
                if (err) {
                    // error 
                    cb({ error: "file_error",
                         message: JSON.stringify(err) });
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
            });
        },
        function (err) {
            if (err) {
                // Some error
                callback(err);
            } else {
                // Return "pages" at a time
                var start = page * page_size;
                var photos = only_files.slice(start, start + page_size);
                var obj = { short_name: album_name.substring(1),
                            photos: photos };
                callback(null, obj);
            }
        });
    });
}

/**
 * All pages come from the same one skeleton HTML file that
 * just changes the name of the JavaScript loader that needs to be
 * downloaded.
 */
function serve_page(req, res) {
    var page = get_page_name(req);
    console.log("Serve basic.html");
    // Read the skeleton HTML file
    fs.readFile('basic.html', (err, contents) => {
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
    });
}

// Handles incoming requests
function handle_incoming_request(req, res) {
    // parse the query params into an object and get the path
    // without them. (2nd param true = parse the params).
    req.parsed_url = url.parse(req.url, true);
    var core_url = req.parsed_url.pathname;
    console.log("Handle incomming request", core_url);

    // test this fixed url to see what they're asking for
    if (core_url.substring(0, 7) == '/pages/') {
        serve_page(req, res);
    } else if (core_url.substring(0, 11) == '/templates/') {
        serve_static_file("templates/" + core_url.substring(11), res);
    } else if (core_url.substring(0, 9) == '/content/') {
        serve_static_file("content/" + core_url.substring(9), res);
    } else if (core_url == '/albums.json') {
        handle_list_albums(req, res);
    } else if (core_url.substr(0, 7) == '/albums'
               && core_url.substr(core_url.length - 5) == '.json') {
        handle_get_album(req, res);
    } else if (core_url.substr(0, 7) == '/albums'
               && core_url.substr(core_url.length - 4) == '.jpg') {
        console.log("Handle jpg image");
        serve_static_file("albums/italy2012/picture_01.jpg", res);
        //handle_get_image(req, res);
    }
    else {
        send_failure(res, 404, invalid_resource());
    }
}

// Function to handle list albums
function handle_list_albums(req, res) {
    console.log("List albums");
    load_album_list((err, albums) => {
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
    var album_name = get_album_name(req);
    var getp = get_query_params(req);
    var page_num = getp.page ? getp.page : 0;
    var page_size = getp.page_size ? getp.page_size : 1000;

    if (isNaN(parseInt(page_num))) page_num = 0;
    if (isNaN(parseInt(page_size))) page_size = 1000;

    load_album(album_name, page_num, page_size, (err, album_contents) => {
        if (err && err == "no_such_album") {
            send_failure(res, 404, err);
        }  else if (err) {
            send_failure(res, 500, err);
        } else {
            send_success(res, { album_data: album_contents });
        }
    });
}

// General helper functions 
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
    return { error: "invalid_resource",
             message: "the requested resource does not exist." };
}

function no_such_album() {
    return { error: "no_such_album",
             message: "The specified album does not exist" };
}

function get_album_name(req) {
    var core_url = req.parsed_url.pathname;
    return core_url.substr(7, core_url.length - 12);
}

function get_template_name(req) {
    var core_url = req.parsed_url.pathname;
    return core_url.substring(11);       // remove /templates/
}

function get_query_params(req) {
    return req.parsed_url.query;
}

function get_page_name(req) {
    var core_url = req.parsed_url.pathname;
    var parts = core_url.split("/");
    return parts[2];
}


// Create a server on port 8080 using "handle_incoming_request"
var s = http.createServer(handle_incoming_request);
s.listen(8080);
