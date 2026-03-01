var readline = require('readline');

// Define the interface
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Simple RPN calculator using readline");
console.log("  e.g   2 3 * 4 / 5 +  is 6.5");

// Set the prompt and wait for input 
var p = "rpn expression > "
rl.setPrompt(p, p.length);
rl.prompt();

rl.on("line", function (line) {
    // console.log(`line: '${line}'`);
    if ((line == "\n") || (line == "")) {
        rl.close();
        return;
    }

    var parts = line.trim().split(new RegExp("[ ]+"));
    var r = rpn_compute(parts);
    if (r !== false) {
        process.stdout.write("Result: " + r + "\n");
    } else {
        process.stdout.write("Invalid expression.\n");
    }
    rl.prompt();
});

rl.on("SIGINT", function () {
    process.stdout.write("\n");
    rl.close();
});


// push numbers onto a stack, pop when we see an operator.
function rpn_compute(parts) {
    var stack = [];
    for (var i = 0; i < parts.length; i++) {
        switch (parts[i]) {
          case '+': case '-': case '*': case '/':
            if (stack.length < 2) return false;
            do_op(stack, parts[i]);
            break;
        default:
            var num = parseFloat(parts[i]);
            if (isNaN(num)) return false;
            stack.push(num);
            break;
        }
    }
    if (stack.length != 1) return false;
    return stack.pop();
}


function do_op(stack, operator) {
    var b = stack.pop();
    var a = stack.pop();
    switch (operator) {
      case '+': stack.push(a + b); break;
      case '-': stack.push(a - b); break;
      case '*': stack.push(a * b); break;
      case '/': stack.push(a / b); break;
      default:  throw new Error("Unexpected operator");
    }
}

