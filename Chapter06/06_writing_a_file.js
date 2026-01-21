// Reading and writing files using pipes

var fs = require('fs');
//var contents;

// INCEPTION BWAAAAAAA!!!!
var rs = fs.createReadStream("01_simple_stream.js");
var ws = fs.createWriteStream("copy_of_01_simple_stream.js");


// Pipe the read file into the write file
rs.pipe(ws);



