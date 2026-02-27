// This assumes you have created a SQL data base and run the
// Chapter09\01_mysql_demos\02_connection_pooling.js example

// to populate the albums and photos table 
// You will need to manually create the users table (see below)

// the data entry fields have a know issues with <cr> characters

// Test cases: 
// http://localhost:8080/pages/login     use rich asdf
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
// npm install path async bcrypt node-uuid

var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    flash = require('express-flash'),
    morgan = require('morgan'),
    multer = require('multer');

var db = require('./data/db.js'),
    album_hdlr = require('./handlers/albums.js'),
    page_hdlr = require('./handlers/pages.js'),
    user_hdlr = require('./handlers/users.js'),
    helpers = require('./handlers/helpers.js');

var app = express();
app.use(express.static(__dirname + "/../static"));

var session_configuration = {
    secret: 'whoopity whoopity whoop whoop',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
};

session_configuration.cookie.secure = false;

app.use(flash());
app.use(session(session_configuration));
app.use(cookieParser('whoopity whoopity whoop whoop'));
app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));

// Parse application/x-www-form-urlencoded & JSON
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var upload = multer({ dest: "uploads/" });

/**
 * Passport authentication methods.
 */
function alwaysAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/pages/login");
    }
}

function pageAuthenticatedOrNot(req, res, next) {
    if ((req.params && req.params.page_name == 'admin')) {
        if (req.isAuthenticated()) {
            next();
        } else {
            res.redirect("/pages/login");
        }
    } else if (req.params && req.params.page_name == "register") {
        if (req.isAuthenticated()) {
            req.logout();
        }
        next();
    } else {
        next();
    }
}

function verifyLoggedOut(req, res, next) {
    if (req.user) {
        req.logout();
    }
    next();
}

passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("app/server.js passport.use");
        user_hdlr.authenticate_user(username, password, (err, user) => {
            if (err && err.code == "invalid_credentials") {
                return done(null, false, {
                    message: 'Incorrect credentials.'
                }); // invalid credentials
            } else if (err) {
                return done(null, false, {
                    message: `Error while authenticating (\(err.code\))`
                }); // auto error
            } else {
                // success
                return done(null, user);
            }
        }); // end .authenticate_user 
    }
));

passport.serializeUser(function(user, done) {
    console.log("app/server.js passport.serializeUser");
    done(null, user.uuid);
});

passport.deserializeUser(function(userid, done) {
    console.log("app/server.js passport.deserializeUser");    
    user_hdlr.user_by_uuid(userid, (err, user) => {
        if (err) {
            done(err, null);
        } else {
            done(null, user);
        }
    });
});

/**
 * API Server requests.
 */
app.get('/v1/albums.json', album_hdlr.list_all);
app.put('/v1/albums.json', alwaysAuthenticated, album_hdlr.create_album);
app.get('/v1/albums/:album_name.json', album_hdlr.album_by_name);
app.get('/v1/albums/:album_name/photos.json', album_hdlr.photos_for_album);
app.put('/v1/albums/:album_name/photos.json',
        alwaysAuthenticated,
        upload.single("photo_file"),
        album_hdlr.add_photo_to_album);

app.put('/v1/users.json', user_hdlr.register);

app.get('/pages/:page_name', pageAuthenticatedOrNot, page_hdlr.generate);
app.get('/pages/:page_name/:sub_page',
        pageAuthenticatedOrNot,
        page_hdlr.generate);

app.post("/service/login",
         passport.authenticate('local', {
             failureRedirect: '/pages/login?fail',
         }),
         function (req, res) {
             // We want pages to have access to this.
             res.cookie("username", req.user.display_name);
             res.redirect("/pages/admin/home");
         }
        );

app.get('/service/logout', function(req, res){
    res.cookie("username", "");
    req.logout();
    res.redirect('/');
});


app.get("/", function (req, res) {
    res.redirect("/pages/home");
    res.end();
});

// No longer works
//app.get('*', four_oh_four);

function four_oh_four(req, res) {
    res.writeHead(404, { "Content-Type" : "application/json" });
    res.end(JSON.stringify(helpers.invalid_resource()) + "\n");
}


db.init();
app.listen(8080);

