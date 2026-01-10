console.time("myTimer"); // Start the timer

// This throws an error
function uhoh () {
    throw new Error("Something bad happened!");
}

// Tes the error handling
try {
    uhoh();
} catch (e) {
    console.timeEnd("myTimer"); // Display the time
    console.warn("    I caught an error: " + e.message);
}

console.log("program is still running\n");
