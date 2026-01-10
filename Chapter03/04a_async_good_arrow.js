
var fs = require('fs');

//fs.open(filename, setFlagsFromString, callback (err, handle))
fs.open('info.txt', 'r', (err, handle) => {
    var buf = Buffer.alloc(100000);  
    // fs.read( handle, bufffer, offset, length, position, callback(error, bytesread)         
    fs.read(handle, buf, 0, 100000, null, (err, length) => {
        console.log("data: len", length, "data:", buf.toString('utf8', 0, length));
        fs.close(handle, () => { /* Don't care */ });
    });
});
