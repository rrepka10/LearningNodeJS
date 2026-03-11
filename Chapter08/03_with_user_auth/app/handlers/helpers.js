
var path = require('path');


exports.version = '0.1.0';




exports.send_success = function(res, data) {
    console.log("app/handlers/helpers.js .send_success");
    res.writeHead(200, {"Content-Type": "application/json"});
    var output = { error: null, data: data };
    res.end(JSON.stringify(output) + "\n");
}


exports.send_failure = function(res, server_code, err) {
    console.log(err);
    var code = (err.code) ? err.code : err.name;
    console.log("app/handlers/helpers.js .send_failure");
    res.writeHead(server_code, { "Content-Type" : "application/json" });
    res.end(JSON.stringify({ error: code, message: err.message }) + "\n");
}


exports.error_for_resp = function (err) {
    console.log("app/handlers/helpers.js .error_for_resp");
    if (!err instanceof Error) {
        console.error("** Unexpected error type! :"
                      + err.constructor.name);
        return JSON.stringify(err);
    } else {
        var code = err.code ? err.code : err.name;
        return JSON.stringify({ error: code,
                                message: err.message });
    }
}

exports.error = function (code, message) {
    var e = new Error(message);
    e.code = code;
    return e;
};

exports.file_error = function (err) {
    console.log("app/handlers/helpers.js .file_error");
    return exports.error("file_error", JSON.stringify(err));
};


exports.is_image = function (filename) {
    console.log("app/handlers/helpers.js .is_image");
    switch (path.extname(filename).toLowerCase()) {
      case '.jpg':  case '.jpeg': case '.png':  case '.bmp':
      case '.gif':  case '.tif':  case '.tiff':
        return true;
    }

    return false;
};


exports.invalid_resource = function () {
    console.log("app/handlers/helpers.js .invalid_resource");
    return exports.error("invalid_resource",
                         "The requested resource does not exist.");
};


exports.missing_data = function (what) {
    console.log("app/handlers/helpers.js .missing_data");
    return exports.error("missing_data",
                         "You must include " + what);
}


exports.not_image = function () {
    console.log("app/handlers/helpers.js .not_image");
    return exports.error("not_image_file",
                         "The uploaded file must be an image file.");
};


exports.no_such_album = function () {
    console.log("app/handlers/helpers.js .no_such_album");
    return exports.error("no_such_album",
                         "The specified album does not exist");
};


exports.http_code_for_error = function (err) {
    console.log("app/handlers/helpers.js .http_code_for_error");
    switch (err.message) {
      case "no_such_album":
        return 403;
      case "invalid_resource":
        return 404;
      case "invalid_email_address":
        return 403;
      case "no_such_user":
        return 403;
    }

    console.log("*** Error needs HTTP response code: " + err.message);
    return 503;
}


exports.valid_filename = function (fn) {
    console.log("app/handlers/helpers.js .valid_filename");
    var re = /[^\.a-zA-Z0-9_-]/;
    return typeof fn == 'string' && fn.length > 0 && !(fn.match(re));
};


exports.invalid_email_address = function () {
    console.log("app/handlers/helpers.js .invalid_emqil_qddress");
	
    return exports.error("invalid_email_address",
                        "That's not a valid email address, sorry");
};

exports.auth_failed = function () {
    console.log("app/handlers/helpers.js .auth_failed");
	
    return exports.error("auth_failure",
                         "Invalid email address / password combination.");
};