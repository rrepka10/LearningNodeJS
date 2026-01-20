// This demonstrates the "factory model"

// Create an object with 2 internal variables and an internal 
// function
function ABC (parms) {
    this.varA = 10;
    this.varB = 20;
    this.functionA = function (var1, var2) {
        console.log("internal function passed values", var1 + " " + var2);
    }
}

// Utilize the exports module to provide a create function
exports.create_ABC = function (parms) {
    return new ABC(parms);
}
