// Create objects 
var obj1 = {};
var obj2 = new Object();

// Create object with Json syntax
var json_syntax = { 
    "field" : "value",
    "field2" : 234,
    "field3" : [ 1 , 2, 3 ],
    "field4" : {
        "subfield1" : "value1"
    }
}

// Create object with normal notation
var obj_notation = {
    field: "value",
    field2: 234,
    field3: [ 1, 2, 3 ],
    field4 : {
        subfield1 : 'value1',
    },
}

console.log("JSON stringify normal notation object to a single line:");
console.log(JSON.stringify(obj_notation));
console.log("\n");

console.log("JSON stringify normal notation, indent 5");
console.log(JSON.stringify(obj_notation, 0, 5));            // 0 means no replacer function
console.log("\n");

console.log("JSON parse of the stringified object:");
console.log(JSON.parse(JSON.stringify(obj_notation)));
console.log("\n");

console.log("For loop, using the obj notation key values:");
for (key in obj_notation) {
    console.log(`${key} : ${obj_notation[key]}`);
}
console.log("\n");

// Other examples of object usage
var user = {
    first_name: "Marc",
    last_name: "Andrews",
    age: Infinity,
    citizenship: "US"
};

console.log("\nUser object:");
console.log(user);
console.log("\n");

user.hair_color = "brown";          // add new field
console.log("Added hair_color field:");
console.log(user);
console.log("\n");

user["eye_color"] = "blue";          // add new field
console.log("Added eye_color field:");
console.log(user);
console.log("\n");

console.log("Invalid access to non-existing field 'height':", user.height);   // undefined
console.log("\n");

delete user.citizenship;            // delete field
console.log("Deleted citizenship field:");
console.log(user);
console.log("\n");