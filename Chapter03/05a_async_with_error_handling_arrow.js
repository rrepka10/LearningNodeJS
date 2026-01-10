var fs = require('fs');

//fs.open(filename, setFlagsFromString, callback (err, handle))
fs.open('info.txt', 'r', (err, handle) => {
    if (err) {
        console.log("ERROR: " + err.code + " (" + err.message + ")");
        return;
    }
//  var buf = new Buffer(100000);         // Deprecated version
    var buf = Buffer.alloc(100000); 
    // fs.read( handle, bufffer, offset, length, position, callback(error, bytesread)          
    fs.read(handle, buf, 0, 100000, null, (err, length) => {
        if (err) {
             // error
            console.log("ERROR: " + err.code
                        + " (" + err.message + ")");
            return;
        }
        console.log("data: len", length, "data:", buf.toString('utf8', 0, length));
        fs.close(handle, () => { /* don't care */ });
    });
});

