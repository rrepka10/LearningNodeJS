// This demonstrates the fix to the possible temporary scope of the
// "this" variable.

var fs = require('fs');

// File object definition and accesors
function FileObject () {
    this.filename = '';

    // exists accessor
    this.file_exists = function (callback) {
        // Save the this pointer for future use
        var self = this;

        if (!this.filename) {
            var e = new Error("invalid_filename");
            e.description = "You need to provide a valid filename";
            callback(e);
            return;
        }

        // Notice we use self, not this, to keep the pointer in scope
        console.log("About to open: " + self.filename);
        // fs.open(filename, flags, callback (err, handle))
        fs.open(this.filename, 'r', function (err, handle) {
            if (err) {
                // self is still in scope
                console.log("Can't open: " + self.filename);
                callback(err, false);
                return;
            }

            fs.close(handle, function () { });
            callback(null, true);
        });
    };
}

var fo = new FileObject();
fo.filename = "file_that_does_not_exist";

fo.file_exists(function (err, results) {
    if (err) {
        console.log("\nError looking for file: : " + JSON.stringify(err));
        return;
    }

    console.log("file exists!!!");
});



