
setTimeout(() => {
    console.log("I've done my work!");
}, 5000);

// This will print first because NodeJS does not wait
console.log("I'm waiting for all my work to finish.");
