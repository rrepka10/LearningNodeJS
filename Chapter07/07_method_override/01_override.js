// This demonstrates the method override tool

// Browser test: http://localhost:8080/

// Replaced methodOverride with method-override

// npm install method-override

var express = require('express');
const methodOverride = require('method-override')
var app = express();

app.use(express.logger());

//app.use(express.methodOverride());
app.use(methodOverride('_method'));

app.use(function (req, res) {
    res.end("You send a request with method: " + req.method);
});

app.listen(8080);
