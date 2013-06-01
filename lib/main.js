var fs = require("fs");

var sweet = require("sweet.js");

var argv = require("optimist")
            .usage("Usage: sweet-contracts [options] path/to/file.js")
            .demand(1)
            .alias('o', 'output')
            .describe('o', 'Output file path')
            .argv;

exports.run = function() {
    var infile = argv._[0];
    var outfile = argv.output;
    var file = fs.readFileSync(infile, "utf8");
    var modulefile = fs.readFileSync("./sweet-contracts.js", "utf8");
    file = modulefile + "\n" + file;

    if(outfile) {
	fs.writeFileSyn(outfile, sweet.compile(file), "utf8");
    } else {
	console.log(sweet.compile(file));
    }
}
