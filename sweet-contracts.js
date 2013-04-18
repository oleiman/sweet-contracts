// require('../contracts.js/src/stacktrace.js');
// require('../contracts.js/lib/contracts.js');

var C = contracts;

macro p_guard {
    case $type => {
        C.check(function(x) {
            return typeof(x) === $type;
        }, $type.toString().toUpperCase())
    }
}

macro def {
    case $handle:ident ($param:ident : $type:lit) : $ret_type:lit {
            return $body:expr
    } => { 
        var $handle = C.guard(
                C.fun(p_guard $type, p_guard $ret_type),
                function ($param) { return $body });
    }
}

//var x = 3;

def foo(x:'number'):'number'{
    return x + x;
}

document.writeln( foo('qux') );




