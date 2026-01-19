// This demonstrates using a POST to upload data

// Test: using POSTMAN:
//  POST    localhost:8080/albums/italy2012/rename.json
//          body -> raw -> JSON: {"album_name" : "italy2012b"}      - change to italy2012b
//
//          http://localhost:8080/albums.json               - to see the changes 
//
//          localhost:8080/albums/italy2012b/rename.json
//          body -> raw -> JSON: {"album_name" : "italy2012"}       - undo the change 
//

//          http://localhost:8080/albums/italy2012.json?page=0&page_size=2      - image 1,2
//
// Postman 
// Note: This used url.parse() which has been deprecated.  Using URL instead


var http = require('http'),
    fs = require('fs');
    // url = require('url');

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

// Do the rename
function do_rename(old_name, new_name, callback) {
    // Rename the album folder.
    // fs.rename(old_name, new, errorCallback)
    fs.rename("albums/" + old_name,
              "albums/" + new_name,
              callback);
}

// provides the directory list of everything in the directory
function handle_incoming_request(req, res) {
/*
    // parse the query params into an object and get the path
    // without them. (2nd param true = parse the params).
    req.parsed_url = url.parse(req.url, true);
    var core_url = req.parsed_url.pathname;
*/

    const url = new URL(req.url, `http://${req.headers.host}/`);
 
    var core_url = url.pathname;	
    req.parsed_url = url;
  
    //album_name:  /italy2012 Page number  0 Page size  21000
    var album_name = url.pathname.substring(7, url.pathname.length-5);

    // console.log("Parsed URL:", req.parsed_url);
    console.log("Handle incoming core Url:", core_url);

    // test this fixed url to see what they're asking for
    if (core_url == '/albums.json') {
        // Generic "get all" http://localhost:8080/albums.json
        handle_list_albums(req, res);
    } else if (core_url.substring(core_url.length - 12)  == '/rename.json'
               && req.method.toLowerCase() == 'post') {
        // Do the rename using postman 
        console.log("rename request");
        handle_rename_album(req, res);
    } else if (core_url.substring(0, 7) == '/albums'
               && core_url.substring(core_url.length - 5) == '.json') {
        // get a specific album http://localhost:8080/albums/italy2012.json
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
// http://localhost:8080/italy2012.json?page=1&page_size=2
function handle_get_album(req, res) {
/*
    // get the GET params
    var getp = req.parsed_url.query;
    var page_num = getp.page ? parseInt(getp.page) : 0;
    var page_size = getp.page_size ? parseInt(getp.page_size) : 1000;

    if (isNaN(parseInt(page_num))) page_num = 0;
    if (isNaN(parseInt(page_size))) page_size = 1000;

    // format of request is /albums/album_name.json
    var core_url = req.parsed_url.pathname;

    var album_name = core_url.substr(7, core_url.length - 12);
*/
    const url = new URL(req.url, `http://${req.headers.host}/`);
    const query = new URLSearchParams(url.search);
    //console.log("URL object", url);
    //console.log("query object", query);

    //Core URL:  /albums/italy2012.json
    // console.log("core url", url.pathname);	
  
    //album_name:  /italy2012 Page number  0 Page size  21000
    var album_name = url.pathname.substring(7, url.pathname.length-5);

    // Force the values to integers
    var page_num  = url.searchParams.get("page")      ? parseInt(url.searchParams.get("page")) : 0;
    var page_size = url.searchParams.get("page_size") ? parseInt(url.searchParams.get("page_size")) : 1000;

     // Give the optional parameters default values if necessary
    if (isNaN(parseInt(page_num)))  page_num = 0;
    if (isNaN(parseInt(page_size))) page_size = 1000;

    console.log("album_name:", album_name, "Page number:", page_num,  "Page size:", page_size);

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

// This does the rename
function handle_rename_album(req, res) {
    // 1. Get the album name from the URL
    var core_url = req.parsed_url.pathname;
    var parts = core_url.split('/');
    console.log("Rename Core URL parts:", parts);
    if (parts.length != 4) {
        // Someone forgot to include the json data
        send_failure(res, 404, invalid_resource());
        return;
    }

    var album_name = parts[2];

    // 2. Add a listener to get the POST data for the request. 
    // this will have the JSON for the new name for the album.
    var json_body = '';
    req.on('readable', () => {
        var d = req.read();
        if (d) {
            if (typeof d == 'string') {
                console.log("Listener type string:", d);
                json_body += d;
            } else if (typeof d == 'object' && d instanceof Buffer) {
                // Convert the passed JSON back to normal text
                json_body += d.toString('utf8');
            }
        }
    });

    // 3. Add a listener for the end of the post data, make sure we have valid
    //    data and then try to do the rename.
    req.on('end', () => {
        // did we get a valid body?
        if (json_body) {
            try {
                // Parse the JSON
                var album_data = JSON.parse(json_body);
                if (!album_data.album_name) {
                    // JSON is missing the album_name keywoard
                    send_failure(res, 404, missing_data('album_name'));
                    return;
                }
            } catch (e) {
                // got a body, but not valid json
                send_failure(res, 403, bad_json());
                return;
            }

            // we have a proposed new album name!
            do_rename(album_name, album_data.album_name, (err, results) => {
                if (err && err.code == "ENOENT") {
                    // Send the no album found
                    send_failure(res, 403, no_such_album());
                    return;
                } else if (err) {
                    // some other error
                    send_failure(res, 500, file_error(err));
                    return;
                }
                
                // Success
                send_success(res, null);
            });
        } else {

            // Error, bad json
            send_failure(res, 403, bad_json());
            res.end();
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

function bad_json() {
    return make_error("invalid_json",
                      "the provided data is not valid JSON");
}

// Create a server on port 8080 using "handle_incoming_request"
var s = http.createServer(handle_incoming_request);
s.listen(8080);
