
// Define the empty class
function Shape () {
}

// Initilize the empty class with two elements
Shape.prototype.X = -1;         // used to demonstrate the initilization phase
Shape.prototype.Y = -2;

// Define the accessor to set the class data
Shape.prototype.move = function (x, y) {
    this.X = x;
    this.Y = y;
}

// Define an accessor to process the class data
Shape.prototype.distance_from_origin = function () {
    return Math.sqrt(this.X*this.X + this.Y*this.Y);
}

// Define an accessor to process the class data
Shape.prototype.area = function () {
    throw new Error("I'm not a real shape yet");
}

//----------------------------------------------------
// Alternative syntax 
// Define the empty class
function Shape2 () {
    this.X = -2;            // used to demonstrate the initilization phase
    this.Y = -3;

    // Define the accessor to set the class data
    this.move = function (x, y) {
        this.X = x;
        this.Y = y;
    } // End accessor
  
    // Define an accessor to process the class data
    this.distance_from_origin = function () {
        return Math.sqrt(this.X*this.X + this.Y*this.Y);
    } // End accessor

    // Define an accessor to process the class data
    this.area = function () {
        throw new Error("I'm not a real shape yet");
    } // End accessor
}  // End Shape object
//----------------------------------------------------


// Create a shape object
var s2 = new Shape2();
console.log("s2 object before move:", s2);
s2.move(10, 10);
console.log("s2 object after move:", s2);
console.log("Using the s2 object", s2.distance_from_origin());
console.log("");

// Create a shape object
var s = new Shape();
console.log("s object before move:", s);
s.move(10, 10);
console.log("s object after move:", s);
console.log("Using the s object", s.distance_from_origin());
console.log("");

// Define the empty class
function Square() {
}

// Initilize the empty class elements
Square.prototype = new Shape();
Square.prototype.__proto__ = Shape.prototype;
Square.prototype.Width = 0;

// Define an accessor to process the class data
Square.prototype.area = function () {
    return this.Width * this.Width;
}

var sq = new Square();
console.log("sq object before move:", sq);
sq.move(-5, -5);
sq.Width = 5;
console.log("sq object after/width move:", sq);
console.log("sq object area:", sq.area());
console.log("sq object distance:", sq.distance_from_origin());
console.log("");


// Define the empty class
function Rectangle () {
}

// Initilize the empty class elements
Rectangle.prototype = new Square();
Rectangle.prototype.__proto__ = Square.prototype;
Rectangle.prototype.Height = 0;

// Define an accessor to process the class data
Rectangle.prototype.area = function () {
    return this.Width * this.Height;
}


var re = new Rectangle();
re.move(25, 25);
re.Width = 10;
re.Height = 5;
console.log("Rectangle area:", re.area());
console.log("Rectangle distance:", re.distance_from_origin());
console.log("");

// Report the data type
console.log("Type of s:", typeof s);
console.log("Type of sq:",typeof sq);
console.log("Type of re:",typeof re);
console.log("");

// Verify inheritance 
console.log("sq instance of Square:   ", sq instanceof Square);
console.log("sq instance of Shape:    ", sq instanceof Shape);
console.log("sq instance of Rectangle:", sq instanceof Rectangle);
console.log("re instance of Rectange: ", re instanceof Rectangle);
console.log("re instance of Square:   ", re instanceof Square);
console.log("sq instance of Date:     ", sq instanceof Date);
