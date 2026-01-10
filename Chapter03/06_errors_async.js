// Error is not caught because steTimeout() is "successful" 
// e.g. the setTimeout worked and is delaying. 
// When the timeoutp expires, the error is thrown to the 
// generic enviroment. 

try {
    setTimeout(function () {
        throw new Error("Uh oh, something bad!");
    }, 2000);
} catch (e) {
    console.log("I caught the error: " + e.message);
}
