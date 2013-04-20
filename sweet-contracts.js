
var C = contracts;
var Num = 'number';
var Str = 'string';

macro vbl {
    case ($p_type -> $ret_type) => {
	C.fun(vbl $p_type, vbl $ret_type)
    }
    case $type => {
        C.check(function(x) {
            return typeof(x) === $type;
        }, $type)
    }


    // case ($($p_type) (->) ... -> $ret_type) => {
    // 	C.fun([(vbl $p_type) (,) ...], vbl $ret_type)
    // }
}

macro def {
    case $handle:ident ($($param:ident : $type:expr) (,) ...) : $ret_type {
//	    $($expression:expr) ...
            return $body:expr
    } => { 
        var $handle = C.guard(
            C.fun([(vbl $type) (,) ...], vbl $ret_type),
            function ($($param,) ...) { 
		return $body });
    }
}

def foo(x:Num):Num{
    return x + x;
}

document.writeln( foo(3) );

def bar(x:Num, y:Str):Str {
    return y;
}

document.writeln( bar(5, 'five') );

def qux(y:Str):(Num -> Str) {
    return function (z) { return y; }
}

document.writeln( qux('quxer')(7) );
document.writeln( qux('quxer')('7') );






