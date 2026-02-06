// This is an example of async.parallel, each function is
// independant and is executed in a parallel.  The
// results arereturned in a JSON array using "callback"

var async = require("async");

async.parallel({
	// an paralled operation which returns data, callback contains the returned data
    numbers: function (callback) {
        setTimeout(function () {
            callback(null, [ 1, 2, 3 ]); }, 1500);
    },
	
	// an parallel operation which returns data, callback contains the returned data
    strings: function (callback) {
        setTimeout(function () {
            callback(null, [ "a", "b", "c" ]); }, 2000);
    },
	
	// another operation which returns data
    primes: function (callback) {
		 {callback(null, [ 2,5, 7]);}
    }
},

// the final result function
function (err, results) {
    console.log("The returned PARALLEL data, notice the order", results);
});
