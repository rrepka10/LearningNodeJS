// Desmonstrates a simple message logger

// Curl test: curl -i localhost:8080/blargh

// npm install express          web server 
// npm install morgan           message logging 
// npm install response-time



var express = require('express'),
    morgan = require('morgan'),
    responseTime = require('response-time');

var app = express();

app.use(morgan('dev'))
    // move this to AFTER the next use() and see what happens!
    /*
    // curl -i localhost:8080/blargh
    // HTTP/1.1 200 OK
    // X-Powered-By: Express
    // Date: Mon, 26 Jan 2026 20:03:20 GMT
    // Connection: keep-alive
    // Keep-Alive: timeout=5
    // Content-Length: 12
    .use(function(req, res){            
        res.end('hello world\n');
    })
       */ 
    .use(responseTime())
  
    // Curl: curl -i localhost:8080/blargh
    // HTTP/1.1 200 OK
    // X-Powered-By: Express
    // X-Response-Time: 0.430ms            // Notice this 
    // Date: Mon, 26 Jan 2026 20:03:44 GMT
    // Connection: keep-alive
    // Keep-Alive: timeout=5
    // Content-Length: 12
    .use(function(req, res){            
  
        res.end('hello world\n');
    })
        
    .listen(8080);
