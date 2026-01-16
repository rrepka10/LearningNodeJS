// Web service to return a directory listing using recursion to filter
// the results to directories only.
// test: browser http://localhost:8080/ 
// This now returns only subdirectories. 

var http = require('http'),
    fs = require('fs');

// provides the directory list of everything in the directory
function load_album_list(callback) {
    // read the albums directory and check for folders
    // fs.readdir(path, options, callback(err, filedata))
    fs.readdir("albums", (err, files) => {
        if (err) {
            // Pass the error back
            callback(err);
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
                    // Pass the error back
                    callback(err);
                    return;
                }

                // Check that the stat call back is a directory
                if (stats.isDirectory()) {
                    // This is a directory, add the name to the directory variable
                    only_dirs.push(files[index]);
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

