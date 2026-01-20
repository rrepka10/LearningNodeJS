// This demonstartes the async parallel method.
// It is simular to the series method in that
// an array of operations are identified
// and the results are returned in an array

// npm install --save async

var async = require("async");

async.parallel({

    // Enumerated key to return in an array, in parallel
    numbers: function (callback) {
        setTimeout(function () {
            callback(null, [ 1, 2, 3 ]);
        }, 1500);
    },

    // Enumerated key to return in an array, in parallel
    strings: function (callback) {
        setTimeout(function () {
            callback(null, [ "a", "b", "c" ]);
        }, 2000);
    }
},

// Call back to capture the results and then
// print the results
function (err, results) {
    console.log("parallel:", results);
});
