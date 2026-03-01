// Simple server program, called by roundrobin.js
// On windows you must start 3 command consoles to
// run with: node simple.js 8081, then 8082 and 8083

var http = require('http');

console.log("Process ARGV:", process.argv);

if (process.argv.length != 3) {
    console.log("Need a port number");
    process.exit(-1);
}

var s = http.createServer(function (req, res) {
    console.log("I listened on port " + process.argv[2] + "\n");
    res.end("I listened on port " + process.argv[2] + "\n");
});

s.listen(process.argv[2]);
