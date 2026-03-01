process.stdout.write("This will prompt for data and then generate\n");
process.stdout.write("a md5 hash value\n");
process.stdout.write("Hash-o-tron 3000: Ctrl+D or Empty line quits)\n");
process.stdout.write("data to hash > ");

// Read from standard in
process.stdin.on('readable', function () {
    var data = process.stdin.read();
    data = data.trim();
    console.log(`input data: '${data}'`);
    // does nothing 
    //if (data == null) {console.log("Return"); return;}
    //if (data == "\n") {console.log("Exit"); process.exit(0);}

    var hash = require('crypto').createHash('md5');
    hash.update(data);
    process.stdout.write("Hashed to: " + hash.digest('hex') + "\n");
    // process.stdout.write("data to hash > ");
});


process.stdin.setEncoding('utf8');
