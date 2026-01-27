// Example of parsing form data using formidable 

// Browser test: http://localhost:8080/     - will display a form, fill it out
// and submit.  The file will be put in the ul directory 

// npm install formidable 

var formidable = require('formidable'),
    http = require('http'),
    util = require('util');
    fs   = require("fs");

http.createServer(function(req, res) {
    // parse a file upload, put the file in the UL directory
    // and keep the file name
    var form = new formidable.IncomingForm({uploadDir: "./ul",
            keepExtensions: true});

    // If this is a post then process it
    if (req.method.toLowerCase() === "post") {
        form.parse(req, function(err, fields, files) {

                // Show the data returned
                console.log("Fields:", fields);
                console.log("Files:", files);

                // Send the response
                res.writeHead(200, {'content-type': 'text/plain'});
                res.write('received upload:\n\n');
                res.end(util.inspect({fields: fields, files: files}));
            });
        }
    else {
        // Serve the HTML form
        fs.readFile("formidable.html", (err, data) => {
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);  
            });
        }

    }).listen(8080);