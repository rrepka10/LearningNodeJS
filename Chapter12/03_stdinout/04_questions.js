var readline = require('readline'),
    async = require("async"),
    fs = require('fs');

var questions = [ "What's your favourite colour? ",
                  "What's your shoe size? ",
                  "Cats or dogs? ",
                  "Doctor Who or Doctor House? " ];

var rl = readline.createInterface({                    // 1.
    input: process.stdin,
    output: process.stdout
});

console.log("This prompts for a list of questions, one at a time");
console.log("and writes the answers into 'answers.txt'");

// Used to collect the answers 
var output = [];

// Use async to force one question/answer at a time
async.forEachSeries(
    questions,
    function (item, cb) { 
        // 2. Use readline to process the questions
        // array                             
        rl.question(item, function (answer) {
            // Add the answer to the output array
            output.push(answer);
            cb(null);
        });
    },

    function (err) {                                   // 3.
        if (err) {
            console.log("Hunh, couldn't get answers");
            console.log(err);
            return;
        } 

        // Wrote the data out
        fs.appendFileSync("answers.txt", JSON.stringify(output) + "\n");
        console.log("\nThanks for your answers, see answers.txt");
        rl.close();
    }
);


