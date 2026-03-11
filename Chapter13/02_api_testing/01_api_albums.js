// This tests the mongoDB albums API, it could also test the mySQL server too.
// Run Chapter08\02_create_album\createDB.js then remove all album and
// photo data from the mongoDB database.  Keep the users data base 
// run Chapter08\03_with_user_auth\app\server.js  as you test service 

// Run test:  npx nodeunit .\01_api_albums.js

// npm install nodeunit

// var request = require('request');
const superagent = require('superagent');
const cookie = require('cookie');


var h = "http://localhost:8080";
var setCookie; 

let agent;
var pwCookie;

exports.setUp = function (done) {
 // console.log("setup");
  agent = superagent.agent(); // cookie jar
  done();
};

exports.tearDown = function (done) {
  // no server to stop; we didn't start it
  done();
};


exports.three_albums = function (test) {
    console.log("three albums test, expects 3 albums in the DB");
    test.expect(2);
    agent.get(h + "/v1/albums.json")
        .then ((resp) => {
        test.equal(resp.statusCode, 200);
        const albums = resp.body.data.albums.length;
        test.equal(albums, 3);
        test.done();
        })
    .catch((err) => { 
        console.error("Requires only three albums! err:", err);
        test.done(err);
    });
};

exports.login = function (test) {
    console.log("login test");
    test.expect(4);

    agent.post(h + "/service/login").send({email_address: "rrepka10@gmail.com", password: "asdf"})
        .then ((resp) => {
        test.equal(resp.statusCode, 200);

        // verify the Set-Cookie header
        test.ok(resp.headers['set-cookie'], 'should have Set-Cookie header');
        const raw = resp.headers['set-cookie'][0] || '';
        test.ok(/session=/.test(raw), 'Set-Cookie should contain "session"');

        // Save our cookies to use later
        pwCookie = cookie.parse(resp.headers['set-cookie'][0]);
 //       console.log("--------------parsed session:", pwCookie['session']);

 test.equal(resp.body.data.logged_in, true);
        test.done();
    })
        .catch((err) => { 
        console.error("login error err:", err);
        test.done(err);
    });
};

// Album data structure
// {_id: "unique", name: "name", title: "something", date: "2012/02/15", description: "something"}
exports.create_album = function (test) {
    console.log("create_album test");
    var d = "We went to HK ";
    var t = "New Years in Hong Kong";

    test.expect(1);
    agent.put(h + "/v1/albums.json")     
        .auth("rrepka10@gmail.com:", pwCookie['session'])
        .send({  _id: "hongkong2012",
                  name: "hongkong2012",
                  title: t,
                  description: d,
                  date: "2012-12-28" })
        .then ((resp) => {
              test.equal(resp.statusCode, 200);
            test.done();
        })
        .catch((err) => { 
            console.error("create album error err:\n", err);
            test.done(err);
    });        
}


exports.four_albums = function (test) {
    console.log("four albums test, expects 4 albums in the DB");
    test.expect(2);
    agent.get(h + "/v1/albums.json")
        .then ((resp) => {
        test.equal(resp.statusCode, 200);
        const albums = resp.body.data.albums.length;
        test.equal(albums, 4);
        test.done();
        })
    .catch((err) => { 
        console.error("Should have four three albums! err:", err);
        test.done(err);
    });
};

