// This demonstrates the promise interface using bluebird

// npm install --save bluebird

// Used to automatically add promise interfaces to other libraries 
var Promise = require("bluebird");

// Only use the promise fs modules 
var fs = Promise.promisifyAll(require("fs"));

// define the object
function load_file_contents2(filename, callback) {
    // Error handler call back
    var errorHandler = (err) => {
        console.log("SO SAD: " + err);
        callback(err, null);
    }

    // Use the async open
    fs.openAsync(filename, 'r')                                     // async file open
        .then(function (fd) {                                       // capture the return file descriptor
            fs.fstatAsync(fd)                                       // get file data using the descriptor
                .then(function (stats) {                            // status captures the stat object data
                    if (stats.isFile()) {                           // verify it is a file
                        // var b = new Buffer(stats.size);
                        var b = Buffer.alloc(stats.size);           // get a buffer

                        return fs.readAsync(fd, b, 0, stats.size, null)
                            .then(fs.closeAsync(fd))                // async close the file
                            .then(function () {
                                callback(null, b.toString('utf8'))  // pass the data back, no errors
                            })
                            // Catch any read errors, call the error object
                            .catch(errorHandler);
                    }
                })
        })
        // Catch any open errors, call the error object
        .catch(errorHandler);
}


// run the test code, read test.txt 
load_file_contents2('test.txt', function (err, results) {
    console.log("ERR: " + err);
    console.log("RESULTS: " + results);
});

