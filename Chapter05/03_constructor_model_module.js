// Constructor model
// 
// npmjs.org - public lists of NPM modules

// Define the object
function ABC () {
    this.varA = 10;
    this.varB = 20;
    this.functionA = function (var1, var2) {
        console.log("internal function passed values", var1 + " " + var2);
    }
}

// Export it 
module.exports = ABC;
