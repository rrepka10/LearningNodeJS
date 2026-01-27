// This demonstrated authentication 

// Browser testing:
// http://localhost:8080/               - Bring up login page
// http://localhost:8080/login          - Display login form

// npm install cookie-parser

var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    flash = require('express-flash');

var app = express();

// Configure security
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

// The list of valid users 
var users = {
    "id123456" :  { id: 123456, username: "marcwan", password: "boo" },
    "id1" : { id: 1, username: "admin", password: "admin" }
};


// Check for authentication
function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        // Yes, so go to the next step
        next();
    }else{
        // No, restart
        res.redirect("/login");
    }
}


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


passport.use(new LocalStrategy(
    function(username, password, done) {
        setTimeout(function () {
        // Process all the users
        for (userid in users) {
            var user = users[userid];
            console.log("Processing:", user);

            // Does the username match
            if (user.username.toLowerCase() == username.toLowerCase()) {
                // YEs, check the password
                if (user.password == password) {
                    // Success, return the user info
                    console.log("PW success");
                    return done(null, user);
                }
            }
        }

        // User not found
        return done(null, false, { message: 'Incorrect credentials.' });
            }, 1000);
    }
));

passport.serializeUser(function(user, done) {
    if (users["id" + user.id]) {
        done(null, "id" + user.id);
    } else {
        done(new Error("WAT"));
    }
});

passport.deserializeUser(function(userid, done) {
    if (users[userid]) {
        done(null, users[userid]);
    } else {
        done(new Error("CANTFINDUSER"));
    }
});


// Root entry, put up a login here page
app.get('/', function(req, res) {
    console.log(req.flash());
    res.send('<a href="/login">Login Here</a>');
});

// Login html
app.get("/login", function (req, res) {

    var error = req.flash("error");

    // Build the login html form
    var form = '<form action="/login" method="post">' +
        '    <div>' +
        '        <label>Username:</label>' +
        '        <input type="text" name="username"/>' +
        '    </div>' +
        '    <div>' +
        '        <label>Password:</label>' +
        '        <input type="password" name="password"/>' +
        '    </div>' +
        '    <div>' +
        '        <input type="submit" value="Log In"/>' +
        '    </div>' +
        '</form>';

    // Was the login successful?
    if (error && error.length) {
        // No, putup a red "Incorrect credentials"
        form = "<b style='color: red'> " + error[0] + "</b><br/>" + form;
    }

    res.send(form);
});

app.post("/login",
         passport.authenticate('local', { successRedirect: '/members',
                                          failureRedirect: '/login',
                                          successFlash: { message: "welcome back" },
                                          failureFlash: true })
        );


app.get("/members", authenticatedOrNot, function (req, res) {
    res.send("secret members only area!");
});


app.listen(8080);
