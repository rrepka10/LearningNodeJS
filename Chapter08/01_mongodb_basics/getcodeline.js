// Returns the current Java code line, like the C/C++ __LINE__ command

function getCurrentLineNumber() {
  const err = new Error();
  const stackLines = err.stack.split('\n').slice(2); // Skip Error + getCurrentLineNumber
  const callerFrame = stackLines[0].trim();
 
  // Regex to extract line number (e.g., "42" from "file.js:42:20")
  const lineNumberMatch = callerFrame.match(/:(\d+):/);
  if (!lineNumberMatch) return 0;
 
  return parseInt(lineNumberMatch[1], 10);
}
 
// Usage
function example() {
  console.log('Current line:', getCurrentLineNumber()); // Output: Line number of the console.log call
}
example();