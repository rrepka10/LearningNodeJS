// This demonstrates using static middleware to 
// automatically serve "static" content

// Browser tests:
// localhost:8080/v1/albums.json
// localhost:8080/v1/albums/italy2012.json
// localhost:8080/pages/home
// http://localhost:8080/pages/album/italy2012

// npm install async

var express = require('express');
var app = express();


var fs = require('fs'),
    // Define our static content handler locations
    album_hdlr = require('./handlers/albums.js'),
    page_hdlr = require('./handlers/pages.js'),
    helpers = require('./handlers/helpers.js');

// Tell express to where the static data is 
app.use(express.static(__dirname + "/../static"));

// Handle the various URLs
app.get('/v1/albums.json', album_hdlr.list_all);
app.get('/v1/albums/:album_name.json', album_hdlr.album_by_name);
app.get('/pages/:page_name', page_hdlr.generate);
app.get('/pages/:page_name/:sub_page', page_hdlr.generate);

// Handle the default case by redirecting 
app.get("/", function (req, res) {
    res.redirect("/pages/home");
    res.end();
});

app.get('*', four_oh_four);

function four_oh_four(req, res) {
    res.writeHead(404, { "Content-Type" : "application/json" });
    res.end(JSON.stringify(helpers.invalid_resource()) + "\n");
}

app.listen(8080);
