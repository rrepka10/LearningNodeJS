

var fs = require('fs');

//fs.open(filename, setFlagsFromString, callback (err, handle))
fs.open(
    // filename, flags
    'info.txt', 'r',  
    // callback              
    function (err, handle) {
        if (err) {
            // error
            console.log("ERROR: " + err.code + " (" + err.message + ")");
            return;
        }

        // Success, handle valid, read 
        var buf = Buffer.alloc(100000);
        // fs.read( handle, bufffer, offset, length, position, callback(error, bytesread)
        fs.read(
            // handle, bufffer, offset, length, position,
            handle, buf, 0, 100000, null,
            // callback(error, bytesread)
            function (err, length) {
                if (err) {
                    // error
                    console.log("ERROR: " + err.code
                                + " (" + err.message + ")");
                    return;
                }
                // Success
                console.log("data: len", length, "data:", buf.toString('utf8', 0, length));
                fs.close(handle, function () { /* don't care */ });
            }
        );
    }
);

