// This demonstrates automated testing.  Edit one of the results
// to see an error case

// npm install nodeunit 

// Run test:  npx nodeunit .\03_group.js

exports.group1 = { 
    setUp: function (callback) {
        // do something
        callback();
    },
    tearDown: function (callback) {
        // do something
        callback();
    },
    test1: function (test) {
        test.done();
    },
    test2: function (test) {
        test.done();
    }
};
