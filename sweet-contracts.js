// require('../contracts.js/src/stacktrace.js');
// require('../contracts.js/lib/contracts.js');

var C = contracts;

macro vbl {
    case $type => {
        C.check(function(x) {
            return typeof(x) === $type;
        }, $type)//.toString().toUpperCase())
    }
    // case ($($param) (->) ... -> $ret_type) => {
    // 	C.fun($(vbl $param,) ... vbl $ret_type),
    // 	function ($($param,
    // }
}

macro def {
    case $handle:ident ($($param:ident : $type:lit) (,) ...) : $ret_type:lit {
	    $($expression:expr) ...
            return $body:expr
    } => { 
        var $handle = C.guard(
                C.fun($(vbl $type,) ... vbl $ret_type),
                function ($($param,) ...) { 
		    return $body });
    }
}

// def foo(x:'number'):'number'{
//     return x + x;
// }

def bar(x:'number', y:'string'):'string' {
    return y;
}

document.writeln( bar(5, 'five') );




