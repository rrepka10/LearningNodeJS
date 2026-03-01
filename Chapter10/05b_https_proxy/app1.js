// This service must be started in a different shell so the proxy
// server can call it

var express = require('express'),
    morgan = require('morgan');

var one = express();
one.use(morgan('dev'));
one.get("/", function(req, res){
    console.log(req);
    res.send("\nWorks!  What part of 'highly classified' do you not understand ;)\n")
});

console.log("Listenting on 8081");
one.listen(8081);
