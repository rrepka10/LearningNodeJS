// Demonstrated compression middlewear with a prod and dev enviroment

// No test to prove this really works
// Browser test: http://localhost:8080/         
// Curl:        curl -I --compressed http://localhost:8080/
// Curl:        curl -I http://localhost:8080/

// npm install express

var express = require('express');
var app = express();

app.use(express.logger('dev'));
app.configure('production', function () {
    app.use(express.compress());
});

app.get('/', function(req, res){
    res.send('hello world this should be compressed\n');
});

app.listen(8080);
