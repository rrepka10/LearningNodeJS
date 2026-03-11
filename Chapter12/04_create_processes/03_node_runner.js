// This demonstrates re-spawn'ing an external script
// after it completes or error's while capturing 
// stdout/stderr output.

// npm install child_process

var spawn = require("child_process").spawn;    
var node;

// Check for command line argurment
if (process.argv.length < 3) {
    console.log("This will re-spawn a processs.")
    console.log("syntax: node 03_node_runner.js <file>");    
    console.log("   file - the a node script to run")
    process.exit(-1);
}

function spawn_node() {
    // Start a thread to run the passed script
    var node = spawn("node", process.argv.slice(2));
    node.stdout.on('data', print_stdout);
    node.stderr.on('data', print_stderr);
    node.on('exit', exited);
}

// The thread call backs
function print_stdout(data) {
    console.log(data.toString('utf8'));
}

function print_stderr(data) {
    console.log("stderr: " + data.toString('utf8'));
}

function exited(code) {
    console.error("--> Node exited with code: " + code + ". Restarting");
    // restart the code
    spawn_node();
}

spawn_node();
