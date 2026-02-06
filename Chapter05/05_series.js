// This is an example of async.series, each function is
// independant and is executed in a serise.  The
// results arereturned in a JSON array using "callback"
// Notice the data is returned in order

var async = require("async");

async.series({
	// an operation which returns data, callback contains the returned data
    numbers: function (callback) {
        setTimeout(function () {callback(null, [ 1, 2, 3 ]);}, 500);
    },
	
	// another operation which returns data
    strings: function (callback) {
        setTimeout(function () {callback(null, [ "a", "b", "c" ]);}, 1000);
    },
	
	// another operation which returns data
    primes: function (callback) {
		 {callback(null, [ 2,5, 7]);}
    }
},

// the final result function
function (err, results) {
    console.log("The returned SERIES JSON object, notice the order", results);
});
