// This demonstrates using an HTML form to send data
// Test: Load 9_form_data.html in your browser
// Enter the data and submit. You will see the name and age 
// fields populated in the console

var http = require('http'), qs = require('querystring');

// Hande the html form submit
function handle_incoming_request(req, res) {
    var body = '';
    // Add a listener to get the POST data from the form
    // this will have the JSON for the name and age
    req.on('readable', () => {
        var d = req.read();
        if (d) {
            if (typeof d == 'string') {
                console.log("Listener type string:", d);
                body += d;
            } else if (typeof d == 'object' && d instanceof Buffer) {
                // Convert the passed JSON back to normal text
                body += d.toString('utf8');
            }
        }
    });

    // Add a listener for the end of the post data
    req.on('end', () => {
        // did we get a post command
        if (req.method.toLowerCase() == 'post') {
            // body contains the JSON
            var POST_data = qs.parse(body);
            console.log(POST_data);
        }
        // Send success
        res.writeHead(200, { "Content-Type" : "application/json" });
        res.end(JSON.stringify( { error: null }) + "\n");
    });
}


// Create a server on port 8080 using "handle_incoming_request"
var s = http.createServer(handle_incoming_request);
s.listen(8080);
