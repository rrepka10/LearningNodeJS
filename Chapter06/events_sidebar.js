// This demonstrates events 
// Testing:  events_sidebar.js   - runs a simulated download with a 2 second weight 
// This doesn't really download anything

var events = require('events');

// Dummy downloader class
function Downloader () {
    console.log("Define downloader function");
}

// Set additional objects on our downloader class
Downloader.prototype = new events.EventEmitter();
Downloader.prototype.__proto__ = events.EventEmitter.prototype;
Downloader.prototype.url = null;

/**
 * Well use the setTimeout function here to simulate what a
 * download function would seem like -- it would take a while
 * to get the file and then call a function when it's done.
 */
Downloader.prototype.download_url = function (path) {
    // Save the this pointer for later
    var self = this;

    // Save the path for later, not used
    self.url = path;

    // Send the start event
    self.emit('start', path);

    // setTimeout(callback, delay)
    setTimeout(function () {
        // Send the end event
        self.emit('end', path);
    }, 2000);
}

// Create a downloader object
var d = new Downloader();

// Register for a start event
d.on("start", function (path) {
    console.log("started downloading: " + path);
});

// Register of the end event
d.on("end", function (path) {
    console.log("finished downloading: " + path);
});

// Set the download URL 
console.log("URL set");
d.download_url("http://marcwan.com");

