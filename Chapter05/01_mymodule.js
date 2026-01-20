
/**
 * Simple example of a module.  Use node in interactive mode
 * to test this
 * var mm = require("./01_mymodule.js");
 * 
 * "factory model" - create an instance
 * mm.greeter("en").greet();                - displays Hello
 * mm.greeter("de").greet();                - displays Hello in German
 * <ctrl-c> twice to exit 
 */

// This demonstrates the "factory model"
function Greeter (lang) {
    this.language = lang;
    this.greet = function () {
        switch (this.language) {
          case "en": return "Hello!";
          case "de": return "Hallo!";
          case "jp": return "こんにちは!";
          default: return "No speaka that language";
        }
    }
}

// Required to make this function accessable as a module
exports.hello_world = function () {
    console.log("Hello World");
}

// Required to make this function accessable as a module
exports.goodbye = function () {
    console.log("Bye bye!");
}

// Required to make this function accessable as a module
exports.greeter = function (lang) {
    return new Greeter(lang);
}

