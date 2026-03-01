#!/usr/local/bin/node
var fs = require('fs'),
    path = require('path');

function mkdirs (path_to_create, mode) {
    console.log("process mask:", process.umask());
    if (mode == undefined)
        {
        // mode = 0777 & (~process.umask());  // deprecated 
        // Set it to what your want and let the OS correct it
        // user r/w/x
        mode = 0700;
        }

    var parts = path_to_create.split(path.sep);
    var i;
    for (i = 0; i < parts.length; i++) {
        var search;
        search = parts.slice(0, i + 1).join(path.sep);
        if (fs.existsSync(search)) {
            var st;
            if ((st = fs.statSync(search))){
                if (!st.isDirectory()) {
                    throw new Error("Intermediate exists, is not a dir!");
                }
            }
        } else {
            // doesn't exist. We can start creating now
            break;
        }
    }

    for (var j = i; j < parts.length; j++) {
        var build = parts.slice(0, j + 1).join(path.sep);
        fs.mkdirSync(build);
    }
}

// Check the numberof paremeters
if (process.argv.length != 3) {
    // bad
    console.log("This can create recursive directories");
    console.log("Usage: " + path.basename(process.argv[1], '.js') 
                + " path_to_create");
} else {
    // Good
    try {
        mkdirs(process.argv[2]);
    } catch (e) {
        console.log("Error creating folder:");
        console.log(e);
        process.exit(-1);
    }
    console.log(process.argv[2], "created, done");
}
