// Very simple web server with a bug
// Test with
// browser http://localhost:8080   and   curl -i http://localhost:8080
// Will cause an error due to a typo in 'length'
// use:  node inspect 02_debug.js   cont, next, step, out, backtrace, 
// repl - reply mode, to examine variables, ctrl-c to exit
// watch('var'), list n, setBreakpoint(n),  .exit

var http = require("http");

var s = http.createServer(function (req, res) {
    var body = 'Thanks for calling!\n';
    var content_length = body.lengtth;
    res.writeHead(200, {
        'Content-Length': content_length,
        'Content-Type': 'text/plain'
    });
    res.end(body);
});

/**
 * Now run the server, listening on port 8080
 */
s.listen(8080);

