#!/usr/local/bin/node
var fs = require('fs');

console.log("This reads and lists the current directory");
var files = fs.readdirSync(".");
console.log(files);

