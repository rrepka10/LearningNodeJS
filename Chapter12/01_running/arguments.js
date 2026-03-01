#!/usr/local/bin/node

console.log("This demonstrates the argv processing");
console.log("Try passing parameters");

console.log("argv[0] is always the interpreter: " + process.argv[0]);
console.log("argv[1] is always the running script: " + process.argv[1]);
console.log("The rest are additional arguments you gave on the command line.");

for (var i = 2; i < process.argv.length; i++) {
    console.log("program parameter " + (i) + " : "
                + process.argv[i]);
}

