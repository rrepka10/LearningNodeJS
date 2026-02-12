$(function(){
 
    var tmpl,   // Main template HTML
    tdata = {};  // JSON data object that feeds the template
 
    // Initialise page
    var initPage = function() {
        console.log("app static content admin_home.js Initialise page");

 
        // Load the HTML template
        $.get("/templates/admin_home.html", function(d){
            tmpl = d;
        });
 
        // Retrieve the server data and then initialise the page  
/*        $.getJSON("/v1/albums.json", function (d) {
            $.extend(tdata, d.data);
        });
 */
        // When AJAX calls are complete parse the template 
        // replacing mustache tags with vars
        $(document).ajaxStop(function () {
            console.log("app static content admin_home.js .ajaxStop");
            var renderedPage = Mustache.to_html( tmpl, tdata );
            $("body").html( renderedPage );
        })    
    }();
});

