// Exampe of a server using user define modules
// Browser Tests:

// http://localhost:8080/pages/home                         Displays a nice album menu
// http://localhost:8080/pages/album/japan2010              Graphically displays all the album images
// http://localhost:8080/albums/japan2010/picture_001.jpg   Displays a specific image 

// This demonstrates a versioned REST API
// http://localhost:8080/v1/albums.json                     Displays the list of albums
// http://localhost:8080/v1/albums/japan2010.json           Displays the list of japan images 
     
// npm install async 
// npm install express

var express = require('express');
var app = express();

// Bring in our standard and personal libraries 
var fs = require('fs'),
    path = require('path'),
    album_hdlr = require('./handlers/albums.js'),
    page_hdlr = require('./handlers/pages.js'),
    helpers = require('./handlers/helpers.js');


// Setup the routing 
app.get('/v1/albums.json', album_hdlr.list_all);
app.get('/v1/albums/:album_name.json', album_hdlr.album_by_name);
app.get('/pages/:page_name', page_hdlr.generate);
app.get('/pages/:page_name/:sub_page', page_hdlr.generate);

app.get('/content/:filename', function (req, res) {
    serve_static_file('content/' + req.params.filename, res);
});

app.get('/albums/:album_name/:filename', function (req, res) {
    serve_static_file('albums/' + req.params.album_name + "/"
                      + req.params.filename, res);
});

app.get('/templates/:template_name', function (req, res) {
    serve_static_file("templates/" + req.params.template_name, res);
});

app.get('*', four_oh_four);


function four_oh_four(req, res) {
    res.writeHead(404, { "Content-Type" : "application/json" });
    res.end(JSON.stringify(helpers.invalid_resource()) + "\n");
}

function serve_static_file(file, res) {
    fs.exists(file, function (exists) {
        if (!exists) {
            res.writeHead(404, { "Content-Type" : "application/json" });
            var out = { error: "not_found",
                        message: "'" + file + "' not found" };
            res.end(JSON.stringify(out) + "\n");
            return;
        }

        var rs = fs.createReadStream(file);
        rs.on(
            'error',
            function (e) {
                res.end();
            }
        );

        var ct = content_type_for_file(file);
        res.writeHead(200, { "Content-Type" : ct });
        rs.pipe(res);
    });
}


// Return the html content type for a file
function content_type_for_file (file) {
    var ext = path.extname(file);
    switch (ext.toLowerCase()) {
        case '.html': return "text/html";
        case ".js": return "text/javascript";
        case ".css": return 'text/css';
        case '.jpg': case '.jpeg': return 'image/jpeg';
        default: return 'text/plain';
    }
}

// Use express to put up a server
app.listen(8080);
