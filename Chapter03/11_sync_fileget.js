// This is an example of a synchronous file read function 
var fs = require('fs');

// fs.open(filename, setFlagsFromString), returns a handle
var handle = fs.openSync('info.txt', 'r');

var buf = Buffer.alloc(100000);  
// fs.readFileSync(handle, nonshared buffer, offset, length, position),
// returns the data.
var read = fs.readSync(handle, buf, 0, 10000, null);
console.log("data: len", read, "data:", buf.toString('utf8', 0, read));
fs.closeSync(handle);