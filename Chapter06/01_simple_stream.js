// This program uses streams to read a file not read()
// This program will read itsself and print out the
// results

var fs = require('fs');
var contents;

// INCEPTION BWAAAAAAA!!!!
var rs = fs.createReadStream("01_simple_stream.js");

// Callback for a readable event
rs.on('readable', () => {
    var str;
    var d = rs.read();          // There is somthing to ready, so read it

    // Did we get anything?
    if (d) {
        // Yes, what is it?
        if (typeof d == 'string') {
            // This part is already of type string
            str = d;
        } else if (typeof d == 'object' && d instanceof Buffer) {
            // Convert the passed JSON back to normal text
            str = d.toString('utf8');
        }

        // Is there some string data?
        if (str) {
            // Yes, is contents defined?
            if (!contents) 
                // No, define it
                contents = d;
            else
                // Yes, add the segment to the overall data
                contents += str;
        }
    }
});

// Callback for an end event
rs.on('end', () => {
    console.log("read in the file contents: ");
    // Convert the buffer into printable data
    console.log(contents.toString('utf8'));
});


