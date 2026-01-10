// inline if statment:
console.log("? if",  1 === 1 ? "one" : "not one");

var x = [ 1, 2, 3, 4, 5, 6, 7 ];
var obj = { a: 1, b : 2, c: 3 };


console.log("\ntraditional for loop on an array, in order:");
for (var i = 0; i < x.length; i++) {
    console.log("index:", i, " value:", x[i]);
}

// for...in loop does NOT guarantee order!!
console.log("\nfor...in on an array, may not be in order:");
for (var idx in x) {
    console.log("index:", idx, " value:", x[idx]);
}

console.log("\nfor...of loop on an array:");
for (var value of x) {
    console.log("Value:", value);
}

console.log("\nfor...in loop on an object:");
for (var key in obj) {
    console.log(`key: ${key} --> value: ${obj[key]}`);
}

console.log("\ntraditional for loop on an object:");
for (var key in Object.keys(obj)) {
    console.log(`key: ${key} --> value: ${obj[key]}`);
}

// Create an error an catch it 
console.log("\nfor...of for simple object: generates an error");
try {
    for (var value of obj) {
        console.log("object for loop:", value);
    }
} catch (e) {
    console.log("This object is not iterable, so you can't use for...of");
    console.log("error:", e.message);
}


