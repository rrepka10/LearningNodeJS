// Constructor model tester

var abc = require('./03_constructor_model_module.js');

// Create an instance of the object 
var obj = new abc();

console.log("The internal variables:", obj.varA, obj.varB);

obj.functionA(1, 2);
