// Trivial express example, using a package.json file

// Browser test:  http://localhost:8080/    displays hello world

// npm install --save express

var express = require('express');

// Create the express object
var app = express();

// Register to handle the root URL
app.get('/', function(req, res){
  res.end('hello world');
});

// Open a server 
app.listen(8080);
