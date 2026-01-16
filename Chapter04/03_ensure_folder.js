// Web service to return a directory listing
// test: browser http://localhost:8080/ 
// This should return only subdirectories but it has a bug and pushes "undefined"

var http = require('http'),
    fs = require('fs');

// provides the directory list of everything in the directory
function load_album_list(callback) {
    // we will just assume that any directory in our 'albums'
    // subfolder is an album.
    // fs.readdir(path, options, callback(err, filedata))
    fs.readdir("albums", (err, files) => {
        if (err) {
            // Pass the error back
            callback(err);
            return;
        }

        // Used to track the directories
        var only_dirs = [];

        for (var i = 0; files && i < files.length; i++) {
            console.log("Processing:", files[i]);

            // fs.stat(path, callback)
            fs.stat("albums/" + files[i], (err, stats) => {
                // Add the file name only if it is a directory
                if (stats.isDirectory()) {
                    console.log("push:", files[i]);
                    only_dirs.push(files[i]);
                }
            });
        }

        // Pass the data back
        callback(null, only_dirs);
    });
}

// provides the directory list of everything in the directory
function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    load_album_list((err, albums) => {  // Using local function
        if (err) {
            // Return the error to the web service
            // res.writeHead(serverStatus, text);               
            res.writeHead(500, {"Content-Type": "application/json"});   // 500 internal server error 
            res.end(JSON.stringify(err) + "\n");
            return;
        }

        // Return the data to the web server
        var out = { error: null,
                    data: { albums: albums }};
        res.writeHead(200, {"Content-Type": "application/json"});       // 200 success
        res.end(JSON.stringify(out) + "\n");
    });
}

// Create a server on port 8080 using "handle_incoming_request"
var s = http.createServer(handle_incoming_request);
s.listen(8080);

