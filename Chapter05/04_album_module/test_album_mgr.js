// This tests our album module code

// Create aninstance
var amgr = require('./album_mgr');


// call our object with a root directory and callback
amgr.albums('./', function (err, albums) {
    if (err) {
        // Error
        console.log("Unexpected error: " + JSON.stringify(err));
        return;
    }

    var iterator = (index) => {
        // Have we processed everything?
        if (index == albums.length) {
            // done
            console.log("Done");
            return;
        }

        albums[index].photos(function (err, photos) {
            if (err) {
                // error
                console.log("Err loading album: " + JSON.stringify(err));
                return;
            }

            // Print out our data
            console.log(albums[index].name);
            console.log(photos);
            console.log("");

            // recursion 
            iterator(index + 1);
        });
    }
    // Start recursion 
    iterator(0);
});

