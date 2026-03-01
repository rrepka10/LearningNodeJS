// Demonstrates the join command

var path = require('path');

// Build an array of objects to put together
var comps = [ '..', 'static', 'photos' ];

// USe join to make the path with backslashes 
console.log(comps.join(path.sep));
