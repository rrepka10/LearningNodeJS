// Demonstrates compression middlewear 

// No test to prove this really works
// Browser test: http://localhost:8080/         
// Curl:        curl -I --compressed http://localhost:8080/
// Curl:        curl -I http://localhost:8080/

// npm install express


import  express from 'express';
var app = express();
import compression from 'compression';

app.use(express.logger('dev'));

app.use(express.compress({
    level: 6, // zlib compression level (0–9)
    filter: (req, res) => {
      if (req.headers['x-no-compress']) {
        console.log("No compresssion");
        return false;
      }
      console.log("compresssion");
      return compression.filter(req, res);
    }}));

app.get('/', function(req, res){
    res.send('hello world this should be compressed\n');
});

app.listen(8080);
