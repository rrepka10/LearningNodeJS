// This demonstrates virtual hosts 

// as admin, edit notepad c:\windows\system32\drivers\etc\hosts
// Add the following 
// 127.0.0.1  app1.local
// 127.0.0.1  app2.local
// 127.0.0.1  app3.local

// test browser with: http://app1.local:8080, http://app2.local:8080
// or http://app3.local:8080


// npm install express vhost path

const express = require('express');
const vhost = require('vhost');
const path = require('path');
const morgan = require('morgan');

const main = express();
main.use(morgan('dev'));


// Create virtual host 1
function createApp1() {
  const app = express();

  // Example middleware unique to app 1
  app.use((req, res, next) => {
    res.setHeader('X-App', 'App 1');
    next();
  });

  // Static assets for app 1
  app.use(express.static(path.join(__dirname, '..', 'public', 'App 1')));

  app.get('/', (req, res) => {
    res.send('<h1>Welcome to App 1</h1>');
  });

  app.get('/health', (req, res) => {
    res.json({ app: 'App 1', status: 'ok' });
  });

  return app;
}

// Create virtual host 2
function createApp2() {
  const app = express();

  // Example middleware unique to app 2
  app.use((req, res, next) => {
    res.setHeader('X-App', 'App 2');
    next();
  });

  // Static assets for app 2
  app.use(express.static(path.join(__dirname, '..', 'public', 'App 2')));

  app.get('/', (req, res) => {
    res.send('<h1>Welcome to App 2</h1>');
  });

  app.get('/health', (req, res) => {
    res.json({ app: 'App 2', status: 'ok' });
  });

  return app;
}

// Create virtual host 3
function createApp3() {
  const app = express();

  // Example middleware unique to app 3
  app.use((req, res, next) => {
    res.setHeader('X-App', 'App 3');
    next();
  });

  // Static assets for app 3
  app.use(express.static(path.join(__dirname, '..', 'public', 'App 3')));

  app.get('/', (req, res) => {
    res.send('<h1>Welcome to App 3</h1>');
  });

  app.get('/health', (req, res) => {
    res.json({ app: 'App 3', status: 'ok' });
  });

  return app;
}

// Use our virtual hosts
main.use(vhost('app1.local', createApp1()));
main.use(vhost('app2.local', createApp2()));
main.use(vhost('app3.local', createApp3()));

// Default/fallback site if no vhost matched
main.get('/', (req, res) => {
  res.send('<h1>Main site (no vhost matched)</h1>');
});

// Example wildcard (*.example.local)
const tenantApp = express();
tenantApp.get('/', (req, res) => {
  res.send(`<h1>Wildcard handled for host: ${req.headers.host}</h1>`);
});
main.use(vhost('*.example.local', tenantApp));

const PORT = 8080;
main.listen(PORT, () => {
  console.log(`Vhost demo running on http://localhost:${PORT}`);
  console.log("Requres updated hosts file:  ")
  console.log('Try http://foo.local:8080 and http://bar.local:8080');
});