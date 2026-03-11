// This demonstrates exec'ing an external program and
// capturing the stdout/stderr output.

// npm install child_process

var exec = require('child_process').exec,
    child;

// Check for command line argurment
if (process.argv.length != 3) {
    console.log("This will exec a process to display a file.")
    console.log("syntax: node 01_simple_exec.js <file>");
    console.log("   file - a file to display");

    process.exit(-1);
}

// get the file name
var file_name = process.argv[2];

// Select the Windows vs Linux display program
var cmd = process.platform == 'win32' ? 'type' : "cat";

// Run the command, data is retured in stdout and stderr
child = exec(cmd + " " + file_name, function (error, stdout, stderr) {
    // print the output 
    console.log('stdout: ' + stdout);
    console.log(" ");
    console.log('stderr: ' + stderr);

    // Handle the error, if any
    if (error) {
        console.log("Error exec'ing the file");
        console.log("  ", error);
        process.exit(1);
    }
});
