// This demonstartes the async auto method.
// Which combines the series and paralle methods.

// npm install --save async
var async = require("async");

async.auto({

    // Enumerated key to return in an array, in parallel
    numbers: (callback) => {
        setTimeout(() => {
            callback(null, [ 1, 2, 3 ]);
        }, 1500);
    },

    // Enumerated key to return in an array, in parallel
    strings: (callback) => {
        setTimeout(() => {
            callback(null, [ "a", "b", "c" ]);
        }, 2000);
    },

    // do not execute this until numbers and strings are done
    // thus_far is an object with numbers and strings as arrays.
    // the series part
    assemble: [ 'numbers', 'strings', (thus_far, callback) => {
        callback(null, {
            numbers: thus_far.numbers.join(",  "),
            strings: "'" + thus_far.strings.join("',  '") + "'"
        });
    }]
},

// this is called at the end when all other functions have executed. Optional
(err, results) => {
    if (err)
        console.log(err);
    else
        console.log("Auto:", results);
});
