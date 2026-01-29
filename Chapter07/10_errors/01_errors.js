// Example of global error handling


var express = require('express');
var app = express();

// Dummy function to alwasy throw an error
app.get('/', function(req, res){
    throw new Error("Something bad happened");
    res.send('Probably will never get to this message.\n');
});

// Global error handler
app.use(function (err, req, res, next) {
    console.log("Error received:", err);

    // Set a browser 500 error code and JSON error message
    res.status(500);
    var err = err instanceof Error
        ? { error: "server_error", message: err.message }
        : err;

    // Tell the browser what happened 
    res.end("Internal program error: " + JSON.stringify(err) + "\n");
});

// This can trap ALL errors, not a good idea in most cases, except for logging
process.on('uncaughtException', function (err) {
    console.log("Uncaught exception:", err);
});

app.listen(8080);


