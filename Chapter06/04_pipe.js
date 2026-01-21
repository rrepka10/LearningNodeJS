// This demonstrates making a http content server using pipes with proper error handling
//
// http://localhost:8080/content/test.html  - returns Hello World!
// http://localhost:8080/content/test.jpg   - returns a picture
// http://localhost:8080/content/test2.jpg  - returns an error and keeps running


var http = require('http'),
    path = require('path'),
    fs = require('fs');

// Handles the incomming get request and returns the requested data
function handle_incoming_request(req, res) {
    // Is this a http get command with a content sub-path?
    if (req.method.toLowerCase() == 'get'
        && req.url.substring(0, 9) == '/content/') {
        // Yes, serve the file
        console.log("url:", req.url.substring(1));
        serve_static_file(req.url.substring(1), res);
    } else {
        // No, something else
        res.writeHead(404, { "Content-Type" : "application/json" });

        var out = { error: "not_found",
                    message: "'" + req.url + "' not found" };
        res.end(JSON.stringify(out) + "\n");
    }
}

// Open the requested file and send it back 
function serve_static_file(file, res) {
    // Open a stream to the requested file
    var rs = fs.createReadStream(file);

    // get the content type html based on the file extension
    var ct = content_type_for_path(file);

    // Moved for proper error handling
    // res.writeHead(200, { "Content-Type" : ct });

    // If ther is an error, create the html and send it back
    // Note: this has a bug, see 03_static_content_pauses.js for the fix
    rs.on('error', (e) => {
        console.log("Serve error");
        res.writeHead(404, { "Content-Type" : "application/json" });
        var out = { error: "not_found",
                    message: "'" + file + "' not found" };
        res.end(JSON.stringify(out) + "\n");
        return;
    });

    // Only send the header when the data is good 
    const firstTime = 'false';
        if (!firstTime) {
            firstTime = 'true';
            res.writeHead(200, { "Content-Type" : ct });
        }

    // Use a pipe to send the data, no readable, pause, resume, end, etc
    rs.pipe(res);
}

// Returns the http type for select content types based on file extension
function content_type_for_path (file) {
    // Get the extension
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html': return "text/html";
        case ".js": return "text/javascript";
        case ".css": return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jpeg';         // allows jpg & jpeg
        default: return 'text/plain';
    }
}

// Create a server on port 8080 using "handle_incoming_request"
var s = http.createServer(handle_incoming_request);
s.listen(8080);

