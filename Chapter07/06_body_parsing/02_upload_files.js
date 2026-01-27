// Demonstrates uploading files using middleware.  It will upload a GUID 
// file to ul
// to test (Windows): run from the 06_body_parsing directory
// curl -i -H "Expect:" --form album_cover=@oranges.jpg --form albumid=italy2012 http://localhost:8080/uptest

var express = require('express');
//var morgan = require('morgan');
var   multer = require('multer');

// Put uploaded fies in the ul directory
var upload = multer({ dest: "ul/" });

var app = express()
//    .use(morgan('dev'));

app.post('/uptest', upload.single("album_cover"), function (req, res) {
    console.log("BODY: " + JSON.stringify(req.body, 0, 2));
    console.log("FILE: " + JSON.stringify(req.file, 0, 2));

    if (!req.file) {
        res.end("File not included");
    } else if (req.file.fieldname != 'album_cover') {
        res.end("Fieldname not included");
    } else {
        res.end("You have asked to set the album cover for "
                + req.body.albumid
                + " to '" + req.file.originalname + "'\n");
    }
});

app.listen(8080);
