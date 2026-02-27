// This demonstrates a simple secret based, password handler
// and can be used to generate new hash values for the main project
// http://localhost::3000

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

// Mock user database
const users = [
  {
    id: 1,
    username: "rich",
    password: "asdf", // (hashed below)
    passwordHash: "$2b$10$a1ytHaRFniZARAZMPEMpZuBwmql8Hals/fWFDLoIHy69oSd2lMYOG"
  }
];

const app = express();
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(
  session({
    secret: 'whoopity whoopity whoop whoop',
    resave: false,
    saveUninitialized: false
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport Local Strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log("passed user:", username, "password:", password);
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log("User not found");
      return done(null, false, { message: "User not found" });
    }

    // Uncomment this to force a new hash value if the stored
    // value doesn't work.
    // user.passwordHash = await bcrypt.hash(user.password, 10);
    console.log("hash:", user.passwordHash);

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) { 
      console.log("Incorrect PW");
      return done(null, false, { message: "Incorrect password" });
    }
    
    console.log("Correct PW");
    return done(null, user);
  })
);

// Passport serialization
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Routes
app.get("/", (req, res) => {
  res.send(`<form action="/login" method="post">
              <input name="username" placeholder="Username"/>
              <input name="password" type="password" placeholder="Password"/>
              <button type="submit">Login</button>
            </form>`);
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/protected",
    failureRedirect: "/"
  })
);

app.get("/protected", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");
  res.send("You are logged in!");
});


console.log("username:", users[0].username,  "password:", users[0].password);
app.listen(3000, () => console.log("Server running on http://localhost:3000"));