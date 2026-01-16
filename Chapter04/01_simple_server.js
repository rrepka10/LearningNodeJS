// Simple web server, test with: 
// curl -X GET http://localhost:8080/     returns: {"error":null}, shows INCOMING REQUEST: GET /
// curl -X GET http://localhost:8080/junk returns: {"error":null}  shows INCOMING REQUEST: GET /junk

var http = require('http');

function handle_incoming_request(req, res) {
    console.log("INCOMING REQUEST: " + req.method + " " + req.url);
    res.writeHead(200, { "Content-Type" : "application/json" });
    res.end(JSON.stringify( { error: null }) + "\n");
}


var s = http.createServer(handle_incoming_request);

s.listen(8080);

