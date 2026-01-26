// Demonstrates the cookie parser middlewear

// Browser:  http://localhost:8080   - go into browser development mode and see the session cookie
//           http://localhost:8080   - will return the last access time

// npm install express          web server 
// npm install morgan           message logging 
// npm install cookie-parser    cookie handler 
// npm install express-session  for session ID's 

var express = require('express'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    session = require('express-session');


var app = express()
    .use(morgan('dev'))
    .use(cookieParser())
    // Set the session id
    .use(session({ secret: "blargleipoajsdfoiajf",
                   resave: false,
                   saveUninitialized: true,
                   cookie: { maxAge: 1800000 } }))      // Expire 30 minutes

    // Get the last session date 
    .use(function(req, res){
        var x = req.session.last_access;
        req.session.last_access = new Date();
        res.end("You last asked for this page at: " + x);
    })
    .listen(8080);


