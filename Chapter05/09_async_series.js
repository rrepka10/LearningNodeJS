// This demonstartes the async series method.
// results are NOT passed to the next section 
// but are collected in an array

// npm install --save async

var async = require("async");

async.series({
    // Enumerated key to return in an array
    numbers: (callback) => {
        setTimeout(function () {callback(null, [ 1, 2, 3 ]); }, 700);
    },

    // Enumerated key to return in an array
    strings: (callback) => {
        setTimeout(function () {callback(null, [ "a", "b", "c" ]);}, 1000);
    }
},

// Call back to capture the results and then
// print the results
function (err, results) {
    console.log("series:", results);
});
