// This is an example of async.auto, each function is
// independant and is executed in a parallel when it can.  
// If a cuntion requires something from the parallel 
// section, then that function won't execute until the
// JSON data is ready.  The results arereturned in a 
// JSON array using "callback"

var async = require("async");

async.auto({

	// a paralled operation which returns data, callback contains the returned data
    numbers: function (callback) {
		console.log("Starting even numbers");
        setTimeout(function () {callback(null, [ 2, 4, 6 ]);}, 800);
    },

	// a paralled operation which returns data, callback contains the returned data	
    strings: function (callback) {
		console.log("Starting strings numbers");
        setTimeout(function () {callback(null, [ "a", "b", "c"]);}, 000);
    },
	
	// a series operation which returns data, callback contains the returned data
	// this will wait for numbers and strings to complete 
	assemble: ['numbers', 'strings', ({ numbers, strings }, callback) => {
		console.log("Assemble");
		callback(null, { numbers, strings, generated: new Date().toISOString() });
    }]
},

// the final result function
function (err, results) {
    if (err) 
        console.log("Error", err);
    else
        console.log("The full results", results);
}

);

