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
    target.test();
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
//       this is really a problem with the node module...should include -m option
target.build_test = function() {
    ls("test/*.js").forEach(function(file) {
        echo("compiling: " + path.basename(file));
        exec("../sweet.js/bin/sjs -o build/" + path.basename(file) + " -m sweet-contracts.js " + file);
    });
};

target.test_functions = function() {
    target.clean();
    echo("compiling: test_function_contracts");
    exec("../sweet.js/bin/sjs -o build/test_function_contracts.js -m sweet-contracts.js ./test/test_function_contracts.js");
    target.test();
};

target.test_objects = function() {
    target.clean();
    echo("compiling: test_object_contracts");
    exec("../sweet.js/bin/sjs -o build/test_object_contracts.js -m sweet-contracts.js ./test/test_object_contracts.js");
    target.test();
};

target.test_advanced = function() {
    target.clean();
    echo("compiling: test_advanced_contracts");
    exec("../sweet.js/bin/sjs -o build/test_advanced_contracts.js -m sweet-contracts.js ./test/test_advanced_contracts.js");
    target.test();
};

target.test = function() {
    echo("\nrunning tests...");
    if(process.env.NODE_DISABLE_COLORS === "1") {
        Mocha.reporters.Base.useColors = false;
    }
    var mocha = new Mocha();
    mocha.useColors = false;

    fs.readdirSync('build/').filter(function(file) {
        return file.substr(-3) === '.js';
    }).forEach(function(file) {
        mocha.addFile(path.join("build/", file));
    });
    mocha.run();
};
