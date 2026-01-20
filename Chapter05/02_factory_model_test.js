// This "factory model" tester

var fmm = require('./02_factory_model_module.js');

// create an instance
var abc = fmm.create_ABC();

// Access the internal values
console.log("The internal variables:", abc.varA, abc.varB);

// Use the internal function
abc.functionA(4, 5);
