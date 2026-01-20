// Buffers can contain any kind of data

//var b = new Buffer(10000);
var b = Buffer.alloc(10000)

// A 5 chinese character string which is really 15 bytes
var str = "我叫王马克";

// Put the string in the buffer
b.write(str); // default is utf8, which is what we want

// The buffer is 10,000 bytes long
console.log("The string value:", b.toString('utf8'));
console.log("Buffer size:     ", b.length );

// byteLength is useful for working with UTF-8 and buffers
console.log("String length:   ", str.length );
console.log("Byte length:     ", Buffer.byteLength(str) );


//var b1 = new Buffer("My name is ");
// var b2 = new Buffer("Marc");
// The length must be correct or alloc will truncate/iterate
// the string 
var b1 = Buffer.alloc(11,"My name is ");
var b2 = Buffer.alloc(4, "Rich");

var b3 = Buffer.concat([ b1, b2 ]);
console.log("b1:", b1.toString('utf8'), "b2:", b2.toString('utf8'), "b3:", b3.toString('utf8'));

//var bb = new Buffer(100);
var bb = Buffer.alloc(100);

// Fill the buffer with zeros
bb.fill("\0");

console.log("Filled buffer", bb);
//                               skipping 0 bytes from the start
console.log("Reading buffer as an int ", bb.readInt8(0));