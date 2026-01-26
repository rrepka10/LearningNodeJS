// Desmonstrates a simple message logger

// Browser test: 
//   http://localhost:8080              - Displays hello world and a get time stamp
//   http://localhost:8080/blargh       - Displays hello world and a get time stamp with a label

// npm install express          web server 
// npm install morgan           message logging 

var express = require('express'),
    morgan = require('morgan');

// Create an express object
var app = express();

// Enable logging in dev mode, other modes are avalilable 
app.use(morgan('dev'));

app.use(function (req, res) {
    res.end("Hello World");
});

// Start the express server
app.listen(8080);
