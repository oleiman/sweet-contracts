var fs = require("fs");
var path = require("path");
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '.');

//this is gonna want to be a proper module require...
//var sweet = require("../../sweet.js/lib/sweet.js");
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
    var modulefile = fs.readFileSync(lib + "/sweet-contracts.js", "utf8");
    file = modulefile + "\n" + file;

    if(outfile) {
	fs.writeFileSync(outfile, sweet.compile(file), "utf8");
    } else {
	console.log(sweet.compile(file));
    }
}
