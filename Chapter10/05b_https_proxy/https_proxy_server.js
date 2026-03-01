// This demonstrates a simple https prox connection, using local certificates.

// This requires Linux generate certificaton
//  openssl genrsa -out privkey.pem 2048
//  openssl req -new -key privkey.pem -out certreq.csr
//  openssl x509 -req -days 3650 -in certreq.csr -signkey privkey.pem -out newcert.pem
// Which will produce:   newcert.pem  privkey.pem

// Browser testing:  https://localhost:8443/  - You will get the message:
//        Works! What part of 'highly classified' do you not understand

// npm install  async express http-proxy morgan

var httpProxy = require('http-proxy'),
    https = require('https'),
    fs = require('fs');

// 1. Get certificates ready.
var privateKey = fs.readFileSync('privkey.pem').toString();
var certificate = fs.readFileSync('newcert.pem').toString();

var options = {
    key : privateKey,
    cert : certificate
}

// 2. Create an instance of HttpProxy to use with another server
var proxy = httpProxy.createProxyServer({});

// 3. Create https server and start accepting connections.
console.log("Listening on 8443");
https.createServer(options, function (req, res) {
    proxy.web(req, res, { target: "http://localhost:8081" });
}).listen(8443);
