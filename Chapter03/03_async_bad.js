// This read will fail because the fopen() has not finished yet
// so the file handle is invalid.

var fs = require('fs');

var file;
var buf = Buffer.alloc(100000);

//fs.open(filename, setFlagsFromString, callback (err, handle))
fs.open(
    // filename, flags
    'info.txt', 'r',
    // callback  
    function (err, handle) {
        file = handle;
    }
);

// fs.read( handle, bufffer, offset, length, position, callback(error, bytesread)
fs.read(
    file, buf, 0, 100000, null,
    function (err, length) {
        console.log("data: len", length, "data:", buf.toString());
        fs.close(file, function () { /* don't care */ });
    }
);

