
var car1 = [];
var car2 = new Array();
var car3 = new Array(10);
var car4 = new Array(4, 34, 6, 8, 525, 8693, 281, 88, 28, 95, 346);


// creating an array
var arr1 = [];

// set values
for (var i = 0; i < 10; i++) {
    arr1[i] = i;
}

// fills in undefined
arr1.length = 20;
arr1[20] = "new value";

console.log("Arr1 length:  ", arr1.length);     // 21 because we set index 20
console.log("Arr1[0] value:", arr1[0]);         // 0
console.log("Full Arr1:    ", arr1);            // shows all the values including undefined
console.log("");

arr1.push("pushed 20");
console.log("Full Arr1 update:", arr1);            // shows all the values including undefined
console.log("");

delete arr1[20];
console.log("Deleted Arr1 20:", arr1);            // 20 becomes empty (undefined), NOT deleted
console.log("");

arr1.splice(10, 21);
console.log("Spliced 10-21 Arr1:", arr1);         // actually deletes indexes 10 through 20
console.log("");

var val = arr1.pop();
console.log("Popped the last item of Arr1:", val, arr1);  // removes and returns last item
console.log("");

var len = arr1.unshift(19)
console.log("Unshift item of Arr1:", len, arr1);  // adds item to start, returns new length
console.log("");

val = arr1.shift()
console.log("Shift item of Arr1:", val, arr1);  // adds item to start, returns new length
console.log("");



// set values with string index
var arr2 = [];

arr2["cat"] = "meow";
arr2["dog"] = "woof";

console.log("arr2 isArray:", Array.isArray(arr2)); // true, still an array
console.log("arr2 length:  ", arr2.length);     // 0 because no numeric indexes
console.log("arr2[0] value:", arr2[0]);         // undefined because no numeric indexes
console.log("Full arr2:    ", arr2);            // shows entire array including string indexes
console.log("");



// mixed indexes (bad idea)
var arr3 = [];

arr3[2] = 2;
arr3[3] = 3;
arr3["horse"] = "neigh";
arr3["狗"] = "王";


console.log("arr3 length:  ", arr3.length);     // 4 because highest numeric index is 3
console.log("arr3[0] value:", arr3[0]);         // undefined because index 0 not set
console.log("Full arr3:    ", arr3);            // shows entire array including string indexes
console.log("");


// multi-dimensional
//var arr4 = [][];              // not ok
//var arr5 = [3][3];            // not ok

// to create a 3x3
var tx3A = new Array(new Array(3), new Array(3), new Array(3));
var tx3B = [];

// fill in 3 rows with pointers to new arrays
for (var i = 0; i < 3; i++) {
    tx3B[i] = new Array(3);
}


console.log("Full array 3A:", tx3A);
console.log("Full array 3B:", tx3B);
console.log("");


// why use arrays when objects contain much of the same functionality:  
// V8 optmises heavily, extra operations slice(), push pop, shift, unshift


// key operations push pop shift unshift
var random = new Array(1, 342, 53, 38, 85958, 3584934, 8459, 2, 69, 1396, 146, 194);

// print squares using a for loop
console.log("Foreach loop:");
random.forEach(function (element, index, array) {
        // Print the index, square indicator and then the square value
        console.log(index + " " + element + "^2 = " + element * element);
});
console.log("");


// Build a new array of squares using map feature
var squares = random.map(function (element, index, array) {
        return element * element;
});
console.log("Squares array using map():");
console.log(squares);
console.log("");

var evens_only = random.filter(function (element, index, array) {
        return (element % 2) == 0;
});
console.log("Evens only using filter():");
console.log(evens_only);
console.log("");


console.log("Original random array", random);
console.log("length:", random.length);
console.log("");
console.log("Joined array:", random.join("- "));        // Join all the elements into one string
console.log("length:", random.join(", ").length);
console.log("");

// Force sort by value NOT characters
random.sort(function (a,b) {
        var a1 = parseInt(a);
        var b1 = parseInt(b);
        if (a1 < b1) return -1;
        if (a1 > b1) return 1;
        return 0;
});                                   // Sort the array in place
console.log("Sorted by value:", random);
console.log("");
