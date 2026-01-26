// Module to handle pages
// http://localhost:8080/pages/home                         Displays a nice album menu
// http://localhost:8080/pages/album/japan2010              Displays the picture

var helpers = require('./helpers.js'),
    fs = require('fs');

// Always provide a version 
exports.version = "0.1.0";

// Make available as a module function 
exports.generate = function (req, res) {

    // Parse the optional page parameters
    var page = req.params.page_name;
    console.log("Generate:", page)

    // Read basic.html and return it which will then load
    // the client side JavaScript
    fs.readFile(
        'basic.html',
        function (err, contents) {
            if (err) {
                // Error
                helpers.send_failure(res, 500, err);
                return;
            }

            // Make the parameters readable 
            contents = contents.toString('utf8');

            // replace page name, and then dump to output.
            contents = contents.replace('{{PAGE_NAME}}', page);
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(contents);
        }
    );
};
