// # In terminal 1, start cookieServer.js, it will listen on port 3000

//# In terminal 2, run the test: npx nodeunit cookietest.js
// It will "login" to the server and get a "session cookie"
// This code will use the session cookie to get "protected" data

// npm install cookie superagent

const superagent = require('superagent');
const cookie = require('cookie');

const BASE_URL = 'http://127.0.0.1:3000'; // point to running service

let agent;
var parsed;


exports.setUp = function (done) {
  console.log("setup");
  agent = superagent.agent(); // cookie jar
  done();
};

exports.tearDown = function (done) {
  // no server to stop; we didn't start it
  done();
};

exports['no cookie'] = function (test) {    
  test.expect(1);

  // Send the SID with the request  .set('Accept', 'application/json') 
  agent.get(`${BASE_URL}/profile`)
    //.set('Cookie', "sid=abc123") 
  
    .then((res) => {
      test.equal(resp.statusCode, 401);
      test.done();
    })      
   .catch((err) => { 
    test.equal(err.status, 401);
    test.done();
    });
    };


exports['set cookie'] = function (test) {
  test.expect(2);
  // Hit the login URL passing the username and password
  agent.post(`${BASE_URL}/login`).send({ username: 'alice', password: 'secret' })
    .set('Accept', 'application/json')

    .then((res) => {
      // The result will contain our sid cookie
      test.ok(res.headers['set-cookie'], 'should have Set-Cookie header');
      const raw = res.headers['set-cookie'][0] || '';
      test.ok(/sid=/.test(raw), 'Set-Cookie should contain "sid"');
      test.done();
      parsed = cookie.parse(res.headers['set-cookie'][0]);
      console.log(" parsed sid:", parsed.sid);
    })
    .catch((err) => { console.error("set err:", err, test.done(err))});
  };


exports['use cookie'] = function (test) {    
  test.expect(2);

  // Send the SID with the request  .set('Accept', 'application/json') 
  agent.get(`${BASE_URL}/profile`)
    .set('Cookie', "sid=" + parsed.sid) 
  
    .then((res) => {
      console.log('read cookies:', res.body.user.name, res.body.sid );
      test.equal(res.body.user.name, 'Alice', 'should return user data');
      test.equal(res.body.sid, 'abc123', 'should echo session id from cookie');
      test.done();
    })      
   .catch((err) => { console.error("get err:", err, test.done(err))});

    };
