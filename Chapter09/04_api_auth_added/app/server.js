//**********************  DOES NOT WORK *****************
// This assumes you have created a SQL data base and run the
// Chapter09\01_mysql_demos\02_connection_pooling.js example

// To populate the albums and photos table 
// You will need to manually create the users table (see below)

// The data entry fields have a know issues with <cr> characters

// Test cases: 
// http://localhost:8080/pages/login     use rrepka10@gmail.com asdf
//   add a photo to an album and check the data base entry
//   add an album:  Richtest1    test   a test album
// http://localhost:8080/pages/home to get to the album list page

//


// Put a user in the data table 
/*
drop table if exists users;

CREATE TABLE IF NOT EXISTS users 
( user_uuid VARCHAR(50) UNIQUE PRIMARY KEY,
  email_address VARCHAR(150) UNIQUE,

  display_name VARCHAR(100) NOT NULL,
  password VARCHAR(100),

  first_seend_date BIGINT,
  last_modified_date BIGINT,
  deleted BOOL DEFAULT false,

  INDEX(email_address),
  INDEX(user_uuid)
);

// user name: rich  password: asdf
INSERT IGNORE INTO Users VALUES ("rich", "rrepka10@gmail.com", "Rich", "$2b$10$a1ytHaRFniZARAZMPEMpZuBwmql8Hals/fWFDLoIHy69oSd2lMYOG", "1", "1", "0");

show tables; 
select * from users;  
use photoalbums;
    
delete from albums where name = "rich";


*/
// npm install express cookie-parser express-session passport mysql2
// npm install passport-local body-parser express-flash morgan multer
// npm install path async bcrypt node-uuid mysql2 cookie-session

var express = require('express');
var app = express();

var db = require('./data/db.js'),
    album_hdlr = require('./handlers/albums.js'),
    page_hdlr = require('./handlers/pages.js'),
    user_hdlr = require('./handlers/users.js'),
    helpers = require('./handlers/helpers.js'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    // cookieSession = require('cookie-session'),
    session = require('express-session'),
    morgan = require('morgan');

//app.use(express.logger('dev'));
app.use(morgan('dev'));

//app.use(bodyParser({ keepExtensions: true }));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static(__dirname + "/../static"));
//app.use(cookieParser("kitten on  keyboard"));
app.use(cookieParser("whoopity whoopity whoop whoop"));

var session_configuration = {
    secret: 'whoopity whoopity whoop whoop',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
};

session_configuration.cookie.secure = false;
app.use(session(session_configuration));
/* 
app.use(cookieSession({
    secret: "FLUFFY BUNNIES",
    secure: false, 
    httpOnly: true,
    maxAge: 86400000
}));
*/
app.get('/v1/albums.json', album_hdlr.list_all);
app.get('/v1/albums/:album_name.json', album_hdlr.album_by_name);
app.put('/v1/albums.json', requireAPILogin, album_hdlr.create_album);

app.get('/v1/albums/:album_name/photos.json', album_hdlr.photos_for_album);
app.put('/v1/albums/:album_name/photos.json',
        requireAPILogin, album_hdlr.add_photo_to_album);

// add-on requests we support for the purposes of the web interface
// to the server.
app.get('/pages/admin/:sub_page',
        requirePageLogin, page_hdlr.generateAdmin);
app.get('/pages/:page_name', page_hdlr.generate);
app.get('/pages/:page_name/:sub_page', page_hdlr.generate);
app.post('/service/login', user_hdlr.login);

app.put('/v1/users.json', user_hdlr.register);
app.get('/v1/users/:display_name.json', user_hdlr.user_by_display_name);


app.get("/", function (req, res) {
    res.redirect("/pages/home");
    res.end();
});

//app.get('*', four_oh_four);

function four_oh_four(req, res) {
    res.writeHead(404, { "Content-Type" : "application/json" });
    res.end(JSON.stringify(helpers.invalid_resource()) + "\n");
}


function requireAPILogin(req, res, next) {
    console.log("app/server.js requireAPILogin: req.session:", req.session, "logged in:", req.session.logged_in);
    // if they're using the API from the browser, then they'll be auth'd
    if (req.session && req.session.logged_in) {
        next();
        return;
    }
    var rha = req.headers.authorization;
    console.log("  req.headers.authorization:", rha);

    if (rha && rha.search('Basic ') === 0) {
        console.log("  basic auth");
        var creds = new Buffer(rha.split(' ')[1], 'base64').toString();
        var parts = creds.split(":");
        user_hdlr.authenticate_API(
            parts[0],
            parts[1],
            function (err, resp) {
                if (!err && resp) {
                    next();
                } else
                    need_auth(req, res);
            }
        );
    } else {
        console.log("  needs auth");
        need_auth(req, res);
    }
}


function requirePageLogin(req, res, next) {
    console.log("app/server.js requirePageLogin");
    if (req.session && req.session.logged_in) {
        next();
    } else {
        res.redirect("/pages/login");
    }
}

function need_auth(req, res) {
    console.log("app/server.js need_auth");
    res.header('WWW-Authenticate',
               'Basic realm="Authorization required"');
    if (req.headers.authorization) {
        // no more than 1 failure / 5s
        setTimeout(function () {
            res.send('Authentication required\n', 401);
        }, 5000);
    } else {
        res.send('Authentication required\n', 401);
    }
}


app.listen(8080);


