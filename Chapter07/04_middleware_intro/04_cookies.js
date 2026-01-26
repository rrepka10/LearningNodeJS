// Demonstrates the cookie parser middlewear

// Browser:  http://localhost:8080/set   - go into browser development mode and display storage, 
//                                         you will see the pet cookie 
//           http://localhost:8080/set   - will return the cookie, if any 
//           http://localhost:8080/clear - will clear the cookie

// npm install express          web server 
// npm install morgan           message logging 
// npm install cookie-parser    cookie handler 

var express = require('express'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser');

var app = express()
    .use(morgan('dev'))
    .use(cookieParser())
    .use('/set', function(req, res){
        // Set the cookie 
        res.cookie("pet", "Zimbu the Monkey",
                   { expires: new Date(Date.now() + 86400000) });    
        res.end(JSON.stringify(req.query) + "\n");
        console.log("Cookie set");

        })

    .use('/get', function(req, res){
        // Read the cookie 
        var petCookie = req.cookies.pet;
        console.log("Read cookie:", petCookie);
    })
    
    .use('/clear', function(req, res){
        // Clear the cookie 
        res.clearCookie("pet");
        res.send("Cookie cleard");
        console.log("Cookie cleared");
    })

    .listen(8080);


