
var async = require('async'),
    bcrypt = require('bcrypt'),
    db = require("./db.js"),
    uuid = require('node-uuid'),
    backhelp = require("./backend_helpers.js");


exports.version = "0.1.0";

exports.user_by_uuid = function (uuid, callback) {
    console.log("app/data/user.js .user_by_uuid");
    if (!uuid) {
        console.log("   missing uuid");
        callback(backhelp.missing_data("uuid"));}
    else {
        console.log("   uuid:", uuid);
        user_by_field("user_uuid", uuid, callback);}
};

exports.user_by_display_name = function (dn, callback) {
    console.log("app/data/user.js .user_by_display_name");
    if (!dn) {
        console.log("   missing display_name");
        callback(backhelp.missing_data("display_name"));}
    else {
        console.log("   display_name:", dn);
        user_by_field("display_name", dn, callback);}
}

exports.user_by_email_address = function (email, callback) {
    console.log("app/data/user.js .user_by_email_address");
    if (!email) {
        console.log("   missing email address");
        callback(backhelp.missing_data("email"));}
    else {
        console.log("   email_address:", email);
        user_by_field("email_address", email, callback);}
};

exports.register = function (email, display_name, password, callback) {
    var userid;
    async.waterfall([
        // validate ze params
        function (cb) {
            console.log("app/data/user.js validate");
            if (!email || email.indexOf("@") == -1) {
                console.log("  Error invalid_email_address");
			    cb(backhelp.missing_data("email"));}
            else if (!display_name) {
                console.log("  error, bad display_name");
			    cb(backhelp.missing_data("display_name"));}
            else if (!password) {
                console.log("  error, missing password");
			    cb(backhelp.missing_data("password"));}
            else{
                console.log("  good user info");
			    cb(null);}
        },

        // generate a password hash
        function (cb) {
			console.log("  encrypting the PW");
            bcrypt.hash(password, 10, cb);
        },

        // register the account.
        function (hash, cb) {
            console.log("app/data/user.js register");
            userid = uuid();
            var now = Math.round((new Date()).getTime() / 1000);
            db.dbpool.query(
                "INSERT INTO Users VALUES (?, ?, ?, ?, ?, NULL, 0)",
                [ userid, email.trim(), display_name.trim(), hash, now ],
                cb);
        },

        // fetch and return the new user.
        function (results, fields, cb) {
            console.log("app/data/user.js return new user");
            exports.user_by_uuid(userid, cb);
        }
    ],
    function (err, user_data) {
        if (err) {
            if (err.code
                && (err.code == 'ER_DUP_KEYNAME'
                    || err.code == 'ER_EXISTS'
                    || err.code == 'ER_DUP_ENTRY'))
                callback(backhelp.user_already_registered());
            else
                callback (err);
        } else {
            callback(null, user_data);
        }
    });
};


function user_by_field (field, value, callback) {
    var dbc;
    console.log(`app/data/user.js user_by_field: '${field} '${value}'`);
    async.waterfall([
        // fetch the user.
        function (cb) {
            console.log("SELECT * FROM Users WHERE " + field
                    + " = ", value, "AND deleted = false");
            db.dbpool.query(
              "SELECT * FROM Users WHERE " + field
                 + " = ? AND deleted = false", 
                [ value ],
                cb);
        },

        function (rows, fields, cb) {
          //  console.log("app/data/user.js rows:", rows);
            if (!rows || rows.length == 0) {
				console.error("  users.find zero length");
				cb(backhelp.no_such_user());}
            else {
                console.log("app/data/user.js user name found");
                cb(null, rows[0]);
            }
        }
    ],

    function (err, user_data) {
        if (err) {
            console.log("app/data/user.js error handler:", err);
            callback (err);
        } else {
            console.log("app/data/user.js handler: success");
            callback(null, user_data);
        }
    });
}
