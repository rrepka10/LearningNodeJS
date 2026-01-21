// A web server to serve up static content located in "content"

// Browser testing:
// http://localhost:8080/                   - returns not found
// http://localhost:8080/content/test.html  - returns Hello World!
// http://localhost:8080/content/test.jpg   - returns a picture
// http://localhost:8080/content/test2.jpg  - terminates the program

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

    // Write the html header
    res.writeHead(200, { "Content-Type" : ct });

    // If ther is an error, create the html and send it back
    rs.on('error', (e) => {
        console.log("Serve error");
        
        res.writeHead(404, { "Content-Type" : "application/json" });
        var out = { error: "not_found",
                    message: "'" + file + "' not found" };
        res.end(JSON.stringify(out) + "\n");
        return;
    });

    // If we successfuly opened the file, read it
    rs.on('readable', () => {
        var d = rs.read();

        // Were we able to read the file?
        if (d) {
            // Yes, add it to the html.  Note, the stream
            // might not be ready to handle the data
            // We will fix that in the next module.
            res.write(d);
        }
    });

    // Did we hit EOF for the file
    rs.on('end', () => {
        // Yes, close the response
        res.end();  // we're done!!!
    });
}


// Returns the http type for select content types based on file extension
function content_type_for_path (file) {
    // Get the extension
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html': return "text/html";
        case ".js": return "text/javascript";
        case ".css": return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jpeg';     // allows jpg & jpeg
        default: return 'text/plain';
    }
}


// Create a server on port 8080 using "handle_incoming_request"
var s = http.createServer(handle_incoming_request);
s.listen(8080);

