// Web service to return a directory listing
// test: curl -X GET http://localhost:8080/ or use a browser
// returns: {"error":null,"data":{"albums":["australia2010","info.txt","italy2012","japan2010"]}}
// This will return ALL items in the directory, no just subdirectories.

var http = require('http'),
    fs = require('fs');

// The location of the album directory, edit this to introduce errors
const albumDir = "albums";

// provides the directory list of everything in the directory
function load_album_list(callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    // fs.readdir(path, options, callback(err, filedata))
    fs.readdir(
        albumDir,
        function (err, files) {
            if (err) {
                // Pass the error back
                callback(err);
                return;
            }
            // Pass the data back
            callback(null, files);
        }
    );
}

// Handles incoming requests
function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    load_album_list(function (err, albums) {        // Using call back
        if (err) {
            // Return the error to the web service
            // res.writeHead(serverStatus, text);
            res.writeHead(500, {"Content-Type": "application/json"});   // 500 internal server error 
            res.end(JSON.stringify(err) + "\n");
            return;
        }

        // Return the data to the web server
        var out = { error: null, data: { albums: albums } };
        // res.writeHead(serverStatus, text);
        res.writeHead(200, {"Content-Type": "application/json"});       // 200 success
        res.end(JSON.stringify(out) + "\n");
    });
}


// Create a server on port 8080 using "handle_incoming_request"
var s = http.createServer(handle_incoming_request);
s.listen(8080);

