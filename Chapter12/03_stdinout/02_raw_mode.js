process.stdout.write("This will prompt for data and then generate a hash value\n");
process.stdout.write("Hash-o-tron 3000: Ctrl+D or Empty line quits)\n");
process.stdout.write("data to hash > ");

var last_read;
// Read from standard in
process.stdin.on('readable', function () {
    data = process.stdin.read();
    if (!data) return;
    if (!process.stdin.isRaw) {
        console.log("stdin not in raw mode");
        last_read = data;
        if (data == "\n") process.exit(0);
        process.stdout.write("Please select type of hash:\n");
        process.stdout.write("(1 – md5, 2 – sha1, 3 – sha256, 4 – sha512)\n");
        process.stdout.write("[1-4] > ");
        process.stdin.setRawMode(true);
        process.stdin.resume(); // start reading from stdin
        process.stdin.setEncoding('utf8');
    } else {
        var alg;
        console.log("stdin in raw mode, data:", data);

        if (data != '') {
            var c = parseInt(data);
            switch (c) {
                case 1: alg = 'md5'; break;
                case 2: alg = 'sha1'; break;
                case 3: alg = 'sha256'; break;
                case 4: alg = 'sha512'; break;
            }
            console.log("hash mode:", alg);

            // process the data based on the hash selected
            if (alg) {
                var hash = require('crypto').createHash(alg);
                console.log("data to hash is:", last_read);
                hash.update(last_read);
                process.stdout.write("\nHashed to: " + hash.digest('hex'));
                process.stdout.write("\ndata to hash > ");
                process.stdin.setRawMode(false);
            } else {
                process.stdout.write("\nPlease select type of hash:\n");
                process.stdout.write("[1-4] > ");
            }
        } else {
            process.stdout.write("\ndata to hash > ");
            process.stdin.setRawMode(false);
        }
    }
});

process.stdin.setEncoding('utf8')

