// This demonstrates the query string parsing built into express
/**
 * Call this server with some query params to see what happens, i.e.
 * Curl:  curl "localhost:8080/blarg?cat=meow&dog=woof"    - parses into: {"cat":"meow","dog":"woof"}
 */

// npm install express          web server 
// npm install morgan           message logging 
// npm install response-time

var express = require('express'),
    morgan = require('morgan'),
    responseTime = require('response-time');


var app = express()
    .use(morgan('dev'))
    .use(responseTime())
    .use(function(req, res){
        res.end(JSON.stringify(req.query) + "\n");
    })
    
    .listen(8080);
