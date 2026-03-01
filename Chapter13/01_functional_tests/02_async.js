// This demonstrates automated asyncronus testing.  Edit one of the results
// to see an error case

// npm install nodeunit 

// Run test:  npx nodeunit .\02_async.js

exports.async1 = function (test) {
    setTimeout(function () {
        test.equal(true, true);
        test.done();
    }, 2000);
};


exports.async2 = function (test) {
    setTimeout(function () {
        test.equal(true, true);
        test.done();
    }, 1400);
};


