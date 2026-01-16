// This reads the test.json file.  
// You can edit the test.json file to introduce errors
// or edit the filename to introduce errors

var fs = require("fs");

function readJSONFile(filename, callback) {
    fs.readFile(filename, (err, contents) => {
        if (err) {
            callback(err);
        } else {
            try {
                var parsed = JSON.parse(contents);
                callback(null, parsed);
            } catch (e) {
                callback(e);
            }
        }
    });
}



readJSONFile("test.json", (err, results) => {
    if (err) {
        console.log("JSON error:\n", err.message);
    } else {
        console.log("JSON data:\n", JSON.stringify(results, 0, 2));
    }
});
