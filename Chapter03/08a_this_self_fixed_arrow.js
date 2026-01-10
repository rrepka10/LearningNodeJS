// This demonstrates anoter fix to the possible temporary scope of the
// "this" variable.  Arrow functions capture the current scope
// including the "this" pointer value

var fs = require('fs');

// File object definition and accesors
function FileObject () {
    this.filename = '';

    // exists accessor
    this.file_exists = function (callback) {
        if (!this.filename) {
            var e = new Error("invalid_filename");
            e.description = "You need to provide a valid filename";
            callback(e);
            return;
        }

        console.log("About to open: " + this.filename);
        // fs.open(filename, flags, callback (err, handle))
        // arrow saves the "this" pointer value 
        fs.open(this.filename, 'r', (err, handle) => {
            if (err) {
                // This is preserved in this case 
                console.log("Can't open: " + this.filename);
                callback(err, false);
                return;
            }

            fs.close(handle, () => { });
            callback(null, true);
        });
    };
}

var fo = new FileObject();
fo.filename = "file_that_does_not_exist";

fo.file_exists(function (err, results) {
    if (err) {
        console.log("\nError looking for file: " + JSON.stringify(err));
        return;
    }

    console.log("file exists!!!");
});



