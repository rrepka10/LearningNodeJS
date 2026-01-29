// This demonstrated authentication 
// flash messages generate deprecation warning 
// user/pw  admin  admin
// 
// Browser testing:
// http://localhost:8080/               - Bring up login page
// http://localhost:8080/login          - Display login form
// http://localhost:8080/members        - Displays the members only area (after login)
//                                        otherwise displays the login form

// npm install cookie-parser

var express = require('express'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require("passport"),
    LocalStrategy = require('passport-local').Strategy, // define the local strategy
    bodyParser = require('body-parser'),
    flash = require('express-flash');       // For flash messages stored in session
   
    
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Configure security
var session_configuration = {
    secret: 'whoopity whoopity whoop whoop',
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // set true behind HTTPS/Proxy
      maxAge: 1000 * 60 * 60, // 1 hour
    },
};
app.use(session(session_configuration));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// The list of valid users 
var users = {
    "id123456" :  { id: 123456, username: "marcwan", password: "boo" },
    "id1" : { id: 1, username: "admin", password: "admin" }
};


// Check for authentication - class
function authenticatedOrNot(req, res, next){
    if(req.isAuthenticated()){
        // Yes, so go to the next step
        next();
    }else{
        // No, restart
        res.redirect("/login");
    }
}

// Passport Local Strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
        // Process all the users
        for (userid in users) {
            var user = users[userid];
            // console.log("Processing:", user);

            // Does the username match
            if (user.username.toLowerCase() == username.toLowerCase()) {
                // Yes, check the password
                if (user.password == password) {
                    // Success, return the user info
                    console.log("PW success");
                    return done(null, user);
                }
            }
        }

    // No user found or password incorrect, not an "nodejs error"
    return done(null, false, { message: 'Invalid password' });
    } catch (err) {
        // Node js error
        return done(err);
    }
  })
);


// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, done) {
    // Value to serialize and store in session
    if (users["id" + user.id]) {
        done(null, "id" + user.id);
    } else {
        done(new Error("WAT"));
    }
});

// Deserialize the user from the stored session data
passport.deserializeUser(function(userid, done) {
    // Get user data from the serialized id
    if (users[userid]) {
        done(null, users[userid]);
    } else {
        done(new Error("CANTFINDUSER"));
    }
});


// Login html
app.get("/login", function (req, res) {
    if ( !req.isAuthenticated() ) {
        console.log("Login: Not authenticated");
    } else {
        console.log("Login: Authenticated ");
    }

    // Set the flash message
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
        // No, put up a red "Incorrect credentials"
        form = "<b style='color: red'> " + error[0] + "</b><br/>" + form;
    }

    res.send(form);
});

// Process the login form, set a success flash message, allow
// a failure flash message
app.post("/login",
         passport.authenticate('local', { successRedirect: '/members',
                                          failureRedirect: '/login',
                                          successFlash: { message: "Welcome back" },
                                          failureFlash: true })
        );


app.get('/members', authenticatedOrNot, (req, res) => {
     if ( !req.isAuthenticated() ) {
        console.log("Members: authenticated");
    } else {
        console.log("Members: Authenticated ");
    }
  res.send(`Hello, ${req.user.username}! <form method="POST" action="/logout"><button>Logout</button></form>`);
});

// Logout (Passport 0.6+)
app.post('/logout', (req, res, next) => {
     if ( !req.isAuthenticated() ) {
        console.log("Logout 1: Not authenticated");
    } else {
        console.log("Logout 1: Authenticated ");
    }
 
    // Do the logout
    req.logout(err => {
        console.log("req.logout error");   
        if (err) {
            console.log("err:", err);      
            return next(err);
        }

    // Optionally destroy the session and clear the cookie, this does not work
    req.session.destroy(() => {
        console.log("Session destroy & cookie clear");   
        res.clearCookie('connect.sid');
        res.redirect('/');
        });
    });

    if ( !req.isAuthenticated() ) {
        console.log("Logout 2: Not authenticated");
    } else {
        console.log("Logout 2: Authenticated ");
    }

    res.redirect('/'); 
});


// Root entry, put up a login here page
app.get('/', function(req, res) {
    if ( !req.isAuthenticated() ) {
        console.log("Root page: Not authenticated");
    } else {
        console.log("Root page: Authenticated ");
    }

    res.send('<a href="/login">Login Here</a>');
});


app.listen(8080);
