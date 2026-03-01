// This demonstrates a simple https connection, using local certificates.

// This requires Linux generate certificaton
//  openssl genrsa -out privkey.pem 2048
//  openssl req -new -key privkey.pem -out certreq.csr
//  openssl x509 -req -days 3650 -in certreq.csr -signkey privkey.pem -out newcert.pem
// Which will produce:   newcert.pem  privkey.pem

// Browser testing:  https://localhost:8443/  - will get security warnings, that's ok 

// npm instal  async express morgan

var express = require('express'),
    https = require('https'),
    fs = require('fs'),
    morgan = require('morgan');

// 1. Load certificates and create options
var privateKey = fs.readFileSync('privkey.pem').toString();
var certificate = fs.readFileSync('newcert.pem').toString();

var options = {
    key : privateKey,
    cert : certificate
}

// 2. Create express app and set up routing, etc.
var app = express();
app.use(morgan('dev'));
app.get("*", function (req, res) {
      res.end("Thanks for calling securely!\n");
});


// 3. start https server with options and express app.
https.createServer(options, app).listen(8443, function(){
    console.log("Express server listening on port " + 8443);
});
