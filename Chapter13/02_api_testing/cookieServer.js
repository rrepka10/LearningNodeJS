// This is simple server to set and return cookies.  
// Run this service before running cookieTest.sj

const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const sessionId = 'abc123';

// Fake "login": returns a cookie named "sid"
app.post('/login', (req, res) => {
  console.log("Login command");

  // set our fake cookie
  res.cookie('sid', sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    // secure: true, // enable if running over HTTPS
    // signed: true  // requires cookieParser('secret') and using req.signedCookies
  });
  // Return the fake cookie
  console.log("  200 - success");
  return res.status(200).json({ ok: true });
});

// Protected route: requires cookie 'sid'
app.get('/profile', (req, res) => {
  console.log("Profile command");
  const sid = req.cookies.sid; // if signed, use req.signedCookies.sid
  if (!sid) {
    console.log("  error 401: Missing session cookie");
    return res.status(401).json({ error: 'Missing session cookie' });
  } else if (sid != sessionId) {
    console.log("  error 401: Incorrect session cookie");
    return res.status(401).json({ error: 'Incorrect session cookie' });
  }
  console.log("  200-success, correct cookie found:", sid);
  return res.status(200).json({ user: { id: 1, name: 'Alice' }, sid });
});


let server;

// Start the HTTP server 
function start(port = 0) {
  console.log('Start command');
  return new Promise((resolve, reject) => {
    if (server && server.listening) {
      const addr = server.address();
      return resolve({ port: addr.port, url: `http://127.0.0.1:${addr.port}` });
    }
    server = http.createServer(app);
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ port: addr.port, url: `http://127.0.0.1:${addr.port}` });
    });
  });
}

// Stop the HTTP server  
function stop() {
  console.log("Stop command");
  return new Promise((resolve, reject) => {
    if (!server) return resolve();
    server.close((err) => {
      if (err) return reject(err);
      server = undefined;
      resolve();
    });
  });
}

// Start on PORT or 3000
if (true) {
  console.log("Starting server");
  const port = 3000;
  start(port).then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`Server listening at ${url}`);
  }).catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}
