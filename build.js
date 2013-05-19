// TODO: provide some facility to build only a single test. Or perhaps just
//       include build/*.js in the repository, cut out the node middleman...

require("shelljs/make");
var path = require("path");
var fs = require("fs");
var Mocha = require("mocha");

target.all = function() {
    target.clean();
    target.build();
    target.build_test();

};

target.clean = function() {
    if(test('-d', 'build/')) {
	rm("build/*");
    }
};

target.build = function() {
    if(!test('-d', 'build/')) {
        mkdir("build/");
    }
};

// TODO: this is tightly coupled to the structure of my local code directory...
//       perhaps allow user to pass in the location of the sjs binary?
target.build_test = function() {
    ls("test/*.js").forEach(function(file) {
        echo("compiling: " + path.basename(file));
        exec("../sweet.js/bin/sjs -o build/" + path.basename(file) + " -m sweet-contracts.js " + file);
    });
};
