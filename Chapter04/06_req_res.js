// Test with a browser: http://localhost:8080
// will result in a console dump with server info

/*
Common HTTP Response Codes
Informational Responses (1xx)
    100 Continue: The server has received the request headers and the client should proceed to send the request body.
    101 Switching Protocols: The server is switching protocols as requested by the client.

Successful Responses (2xx)
    200 OK: The request has succeeded.
    201 Created: A new resource has been created as a result of the request.
    204 No Content: The request was successful, but there is no content to send back.

Redirection Messages (3xx)
    301 Moved Permanently: The requested resource has been permanently moved to a new URL.
    302 Found: The resource is temporarily available at a different URL.

Client Error Responses (4xx)
    400 Bad Request: The server cannot understand the request due to bad syntax.
    404 Not Found: The requested resource could not be found.

Server Error Responses (5xx)
    500 Internal Server Error: The server encountered an unexpected condition.
    503 Service Unavailable: The server is currently unable to handle the request due to temporary overload or maintenance.
*/

var http = require('http');

// Print out server info in the console 
function handle_incoming_request(req, res) {
    console.log("---Request Headers -------------------------------");
    console.log(req.headers);
    console.log("---Response---------------------------------------");
    console.log(res);
    console.log("---------------------------------------------------");

    // Set a response with "nothing"
    res.writeHead(200, { "Content-Type" : "application/json" });

    // Send the response 
    res.end(JSON.stringify( { error: null }) + "\n");
}

// Create a server on port 8080 using "handle_incoming_request"
var s = http.createServer(handle_incoming_request);
s.listen(8080);

