// This demonstrates the proper parsing of the optional GET "?" parameters
// most of this is identical to 05_mltiple_requests.js
// test: http://localhost:8080/italy2012.json?pages=1?page_size=20
// test: browser http://localhost:8080/albums.json
//               http://localhost:8080/albums/italy2012.json
// An industry standard is to return "pages" of data, to limit the amount of data in any one transfer
// In our case, Italy has 5 images which we are going to return two at a time.
//               http://localhost:8080/albums/italy2012.json?page=0&page_size=21000  - display all
//               http://localhost:8080/albums/italy2012.json?page=0&page_size=2      - image 1,2
//               http://localhost:8080/albums/italy2012.json?page=1&page_size=2      - image 3,4
//               http://localhost:8080/albums/italy2012.json?page=2&page_size=2      - image 5
//               http://localhost:8080/albums/italy2012.json?page=3&page_size=2      - no images
// Note: This uses url.parse() which has been deprecated.  N
//       Needs to be switched to WHATWG URL API

var http = require('http'),
    fs = require('fs'),
    url = require('url');

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
        var iterator = (index) => {
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
                iterator(index + 1)
            });
        }

        // Start the recursion
        iterator(0);
    });
}

// provides the directory list for a specific album
// handle_get_album() parses the incoming URL to provide the data
function load_album(album_name, page, page_size, callback) {
    // Build the specific album name 
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
        var path = "albums/" + album_name + "/";

        // 'files' was passed in the call back,
        // only process the length of the array
        // console.log("files.length:", files ,files.length);
        var iterator = (index) => {
            // Are we done?
            if (index == files.length) {
                // yes
                // only_files[] contains ALL the files, there might be lots
                var ps;

                // page_size = the number of images to return at a time
                var start = page * page_size
                // An industry standard is to return "pages" of data, to limit the amount 
                // of data in any one transfer.  
                // slice fails gracefully if params are out of range
                ps = only_files.slice(start, start + page_size);         
                var obj = { short_name: album_name,
                            photos: ps };
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
                    var obj = { filename: files[index], desc: files[index] };
                    // Add the data to our array
                    only_files.push(obj);
                }
                // use recursion, re-call the function with the next index
                iterator(index + 1)
            });
        }
        // Start the recursion
        iterator(0);
    });
}

// provides the directory list of everything in the directory
function handle_incoming_request(req, res) { 
    // parse the query params into an object and get the path
    // without them. (2nd param true = parse the params).
    // Note: url.parse() has been deprecated, switch to WHATWG URL API
    req.parsed_url = url.parse(req.url, true);
    var core_url = req.parsed_url.pathname;

    // test this fixed url to see what they're asking for
    if (core_url == '/albums.json') {
        // Generic "get all"
        handle_list_albums(req, res);
    } else if (core_url.substr(0, 7) == '/albums'
               && core_url.substr(core_url.length - 5) == '.json') {
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
// BUT with including optional parameters
// http://localhost:8080/italy2012.json?page=1&page_size=20
function handle_get_album(req, res) {
    // format of request is /albums/album_name.json?other stuff
    // get the GET params
    var getp = req.parsed_url.query;

    // Parse the optional parameters base on the tag
    // The page number we are processing 
    var page_num = getp.page ? parseInt(getp.page) : 0;             

    // The number of images to return at a time
    var page_size = getp.page_size ? parseInt(getp.page_size) : 1000; 

    // Give the optional parameters default values if necessary
    if (isNaN(parseInt(page_num))) page_num = 0;
    if (isNaN(parseInt(page_size))) page_size = 1000;

    // format of request is /albums/album_name.json
    // This removes any of the optional parameters
    //              (start) 7          22-12 (end = len-12)
    // e.g core URL:  /albums/italy2012.json
    var core_url = req.parsed_url.pathname;                     
    console.log("Core URL: ", core_url);

    // remove the  "/albums" and ".json"
    var album_name = core_url.substr(7, core_url.length - 12);
    console.log("album_name: ", album_name, "Page number ", page_num,  "Page size ", page_size);

    // page_num and page_size are the optional parameters included
    // on the URL.  
    load_album(album_name, page_num, page_size, (err, album_contents) => {
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
