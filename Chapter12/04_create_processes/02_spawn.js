//  This demonstrates spawning a thread

// npm install child_process

var spawn = require("child_process").spawn;    
var node;

// Check for command line argurment
if (process.argv.length != 3) {
    console.log("This will spawn 2 processs.")
    console.log("syntax: node 02_spawn.js <file>");    
    console.log("   file - the a node script to run");
    process.exit(-1);
}

// Start a thread to run the passed script
var node1 = spawn("node", [ process.argv[2] ]);

// Set the call backs
node1.stdout.on('data', print_stdout);
node1.stderr.on('data', print_stderr);
node1.on('exit', exited);

var node2 = spawn("node", [ process.argv[2] ]);
node2.stdout.on('data', print_stdout);
node2.stderr.on('data', print_stderr);
node2.on('exit', exited);

// The thread call backs
function print_stdout(data) {
    console.log("stdout: " + data.toString('utf8'));
}

function print_stderr(data) {
    console.log("stderr: " + data.toString('utf8'));
}

function exited(code) {
    console.error("--> Node exited with code: " + code);
}
