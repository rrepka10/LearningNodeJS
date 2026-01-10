// This demonstrats a long running, local function that could
// "hang" nodeJS when running on large data sets BUT it 
// gives up control periodically to let Node run other event
// loop items

console.time("timer");

function compute_intersection(arr1, arr2, callback) {

    var bigger = arr1.length > arr2.length ? arr1 : arr2;
    var smaller = bigger == arr1 ? arr2 : arr1;
    var biglen = bigger.length;
    var smlen = smaller.length;

    var sidx = 0;
    var size = 10;          // 100 at a time, can adjust!
    var results = [];

    // Define the local processing instruction
    function sub_compute_intersection() {
        for (var i = sidx; i < (sidx + size) && i < biglen; i++) {
            for (var j = 0; j < smlen; j++) {
                if (bigger[i] == smaller[j]) {
                    results.push(smaller[j]);
                    break;
                }
            }
        } // end for i

        // Return the data when we are done
        if (i >= biglen) {
            callback(null, results);
        } else {
            sidx += size;
            // Not done, give up control 
            process.nextTick(sub_compute_intersection);
        }
    } // End function

    // Call the processing function
    sub_compute_intersection();
}



var a1 = [ 3476, 2457, 7547, 34523, 3, 6, 7,2, 77, 8, 2345,
           7623457, 2347, 23572457, 237457, 234869, 237,
           24572457524] ;
var a2 = [ 3476, 75347547, 2457634563, 56763472, 34574, 2347,
           7, 34652364 , 13461346, 572346, 23723457234, 237,
           234, 24352345, 537, 2345235, 2345675, 34534,
           7582768, 284835, 8553577, 2577257,545634, 457247247,
           2345 ];

compute_intersection(a1, a2, function (err, results) {
    if (err) {
        console.log(err);
    } else {
         console.timeEnd("timer");
        console.log("Results", results);
    }
});

