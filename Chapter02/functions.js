
// regular function
function add_two(a, b) {
    return a + b;
}
console.log("regular function add:", add_two(1, 2));

// Anonymous function -- can be used by referring to x:
var x = function (a, b) {
    return a + b;
}
console.log("anonymous function add:", x(3, 4));

// Anonymous function, using an optional name -- can be used by referring to x:
var y = function addit (a, b) {
    return a + b;
}
console.log("anonymous function add with optional name:", y(3, 4));

// Anonymous function -- THIS IS NOT VALID. If not used as an expression, you
// must provide a name. Uncomment this to see the error:
/*
function (a, b) {
    return a + b;
}
*/

// Arrow functions, all inline, no return
var y = (a , b) => a + b;
console.log("Arrow function 1 add:", y(5, 6));
console.log("Arrow function 1 add -too many variables:", y(5, 6, 7));

// Arrow functions, with explicit return
var z = (a, b) => {
    console.log("ADDING!");
    return a + b;
}
console.log("Arrow function 2 add:", z(7, 8));

// Using optional arguments
function add_n_methodA() {
    var sum = 0;
    for (x of arguments) {
        sum += x;
    }
    return sum;
}
function add_n_methodB() {
    var sum = 0;
    for (index in arguments) {
        sum += arguments[index];
    }
    return sum;
}
function add_n_methodC() {
    var sum = 0;
    for (var i = 0; i < arguments.length; i++) {
        sum += arguments[i];
    }
    return sum;
}

console.log("Optional agruments A:", add_n_methodA(1, 2, 3, 4, 5, 6, 7));
console.log("Optional agruments B:", add_n_methodB(1, 2, 3, 4, 5, 6, 7, 8));
console.log("Optional agruments C:", add_n_methodC(1, 2, 3, 4, 5, 6, 7, 8, 9));
