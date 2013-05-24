macro setupContracts {
    case ($loc) => {
	var C = $loc;
    }
}

// by abstracting this out we actually get stuck with *more* parens

// macro vbl {
//     case ($p_type -> $ret_type) => {
// 	C.fun(vbl $p_type, vbl $ret_type)
//     }
// // case (($p_type -> $ret_type) $[|] $opts) => {
// //     	C.fun([vbl $p_type], vbl $ret_type, opt_obj $opts)
// //     }
//     // this is kinda nice, but we're still stuck with parenthesized predicates...
//     case (($p_type -> $ret_type) $[|] $($key $[:] $opt) (,) ...) => {
//     	C.fun([vbl $p_type], vbl $ret_type, {$($key: (vbl $opt),) ...})
//     }
//     // TODO: find an elegant way to allow a method to have 
//     //  pre/post (not both), if possible
//     // case (($p_type -> $ret_type) $[|]
//     //          pre:  $pre_cond
//     //          post: $post_cond) => {
//     // 	C.fun([vbl $p_type], vbl $ret_type, {
//     // 	    pre: vbl $pre_cond,
//     // 	    post: vbl $post_cond})
//     // }
//     // case (($p_type -> $ret_type) $[|]
//     //          pre:  $pre_cond) => {
//     // 	C.fun([vbl $p_type], vbl $ret_type, {
//     // 	    pre: vbl $pre_cond})
//     // }
//     // case (($p_type -> $ret_type) $[|]
//     //          post: $post_cond) => {
//     // 	C.fun([vbl $p_type], vbl $ret_type, {
//     // 	    post: vbl $post_cond})
//     // }
//     case ($($key $[:] $type) (,) ...) => {
// 	C.object({$($key: (vbl $type),) ...})
//     }
//     case (($($key $[:] $type) (,) ...) $[|] $pred) => {
// 	C.object({$($key: (vbl $type),) ...}, 
// 		 {invariant: vbl $pred})
//     }
//     case [$type (,) ...] => {
// 	C.arr([(vbl $type) (,) ...])
//     }
//     case (? $comb) => {
// 	C.opt(C.$comb)   
//     }
//     case ($comb1 or $comb2) => {
// 	C.or(vbl $comb1, vbl $comb2)
//     }
//     case ($comb1 and $comb2) => {
// 	C.and(vbl $comb1, vbl $comb2)
//     }
//     case (! ($arg:ident) -> { $check ... }) => {
// 	function ($arg) {
// 	    $check ...
// 	}
//     }
//     case (! ($args:ident, $result:ident) -> { $check ... }) => {
// 	function ($args) { 
//     	    return C.check(
// 		function ($result) { $check ... }, 'foobar')
// 	}
//     }
//     case $comb => {
// 	C.$comb 
//     }
//     case [$type $[...]] => {
//     	C.arr([C.___(vbl $type)])
//     }
// }

// TODO: we're stuck with 'some arbitrary name' here. This will be
//       fixed when sweet.js gets some new features


// TODO: this needs to change. see notes
macro bang {
    case ($param:ident) -> $body:expr => {
	C.check(function ($param) $body, 'some arbitrary name');
    }
    case $name:ident ($param:ident) -> $body:expr => {
    	C.$name = C.check(function ($param) $body, 'some arbitrary name')
    }
}

macro def {
    case $handle:ident ($($param:ident : $type) (,) ...) : $ret_type $body => { 
        var $handle = C.guard(
	    C.fun([(vbl $type) (,) ...], vbl $ret_type),
	    function ($($param,) ...) $body);
    }
}


macro vbl {
    case ($[?] $comb1, $rest ...) => {
	vbl (? $comb1), vbl ($rest ...)
    }
    case ($p_type -> $ret_type $[|] $rest ...) => {
	C.fun(vbl ($p_type), vbl ($ret_type), {
	    vbl ($rest ...)
	})
    }
    case ($key:ident $[:] ! ($arg) -> { $check ... }, $rest ...) => {
	$key: function($arg) { $check ... }, vbl ($rest ...)
    }
    case ($key:ident $[:] ! ($arg) -> { $check ... }) => {
	$key: function($arg) { $check ... }
    }
    // the 'this' contract (for objects) goes here
    case ($p_type -> $ret_type, $rest ...) => {
    	vbl ($p_type -> $ret_type), vbl ($rest ...)
    }
    case {$key $[:] $rest ...} => {
	C.object({$key: vbl ($rest ...)})
    }
    case ($key $[:] $rest ...) => {
	$key: vbl ($rest ...)
    }
    case ([$comb, $arr ...], $rest ...) => {
    	C.arr([vbl ($comb), vbl ($arr ...)]), vbl ($rest ...)
    }
    // this contract must come at the end of param list
    case ($[#] $this) => {
	vbl ($this)
    }
    // can't figure our how to get arbitrarily many and/or withouut parens...
    case ($comb1 or $comb2, $rest ...) => {
    	C.or(vbl ($comb1), vbl ($comb2)), vbl ($rest ...)
    }
    case ($comb1 and $comb2, $rest ...) => {
    	C.and(vbl ($comb1), vbl ($comb2)), vbl ($rest ...)
    }
    case ($comb1 or $comb2 $rest ...) => {
	vbl (($comb1 or $comb2) $rest ...)
    }
    case ($comb1 and $com2 $rest ...) => {
	vbl (($comb2 and $comb2) $rest ...)
    }
    case ($comb:ident, $rest ...) => {
	C.$comb, vbl ($rest ...)
    }
    // base cases
    case $p_type -> $ret_type $[|] $opts => {
    	C.fun ([vbl $p_type], vbl $ret_type, {
    	    opts $opts
    	})
    }
    case ($p_type -> $ret_type) => {
	C.fun ([vbl $p_type], vbl $ret_type)
    }
    case (! ($args:ident, $result:ident) -> { $check ... }) => {
	function ($args) {
	    return C.check(
		function ($result) { $check ... }, 'dependent')
	}
    }
    case [$comb, $rest ...] => {
	C.arr([vbl ($comb), vbl ($rest ...)])
    }
    case ($comb1 and $comb2) => {
	C.and(vbl ($comb1), vbl ($comb2))
    }
    case ($comb1 or $comb2) => {
	C.or(vbl ($comb1), vbl ($comb2))
    }
    case ($key: ! ($arg) -> { $check ...} ) => {
	function ($arg) {
	    $check ...
	}
    }
    // this is colliding with the regular ellipses
    // case ($comb $[...]) => {
    // 	C.___(vbl ($comb))
    // }
    case [$comb] => {
    	C.arr([vbl ($comb)])
    }
    case [$comb $[...]] => {
    	C.arr([vbl ($comb)])
    }
    case ($[?] $comb) => {
	C.opt(vbl ($comb))
    }
    case ($comb) => {
    	vbl $comb
    }
    case $comb:ident => {
	C.$comb
    }
}

// so many cases...makes the syntax pretty, though
macro fun {
    case ($parms ...) -> ($ret ...) function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl ($ret ...)),
    	    function $args $body);
    }
    case ($parms ...) -> ! ($argl:ident, $result:ident) -> {$check ...} function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl (! ($argl, $result) -> {$check ...})),
    	    function $args $body);
    }
    case ($parms ...) -> ($ret ...) var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl ($ret ...)),
    	    $def);
    }
    case ($parms ...) -> ! ($argl:ident, $result:ident) -> {$check ...} var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl (! ($argl, $result) -> {$check ...})),
    	    $def);
    }

    // no new
    case ($parms ...) --> ($ret ...) function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl ($ret ...), {callOnly: true}),
    	    function $args $body);
    }
    case ($parms ...) --> ! ($argl:ident, $result:ident) -> {$check ...} function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl (! ($argl, $result) -> {$check ...}), {callOnly: true}),
    	    function $args $body);
    }
    case ($parms ...) --> ($ret ...) var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl ($ret ...), {callOnly: true}),
    	    $def);
    }
    case ($parms ...) --> ! ($argl:ident, $result:ident) -> {$check ...} var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl (! ($argl, $result) -> {$check ...}), {callOnly: true}),
    	    $def);
    }

    // only new
    case ($parms ...) ==> ($ret ...) function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl ($ret ...), {newOnly: true}),
    	    function $args $body);
    }
    case ($parms ...) ==> ! ($argl:ident, $result:ident) -> {$check ...} function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl (! ($argl, $result) -> {$check ...}), {newOnly: true}),
    	    function $args $body);
    }
    case ($parms ...) ==> ($ret ...) var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl ($ret ...), {newOnly: true}),
    	    $def);
    }
    case ($parms ...) ==> ! ($argl:ident, $result:ident) -> {$check ...} var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl ($parms ...)], vbl (! ($argl, $result) -> {$check ...}), {newOnly: true}),
    	    $def);
    }
}

// double duty objects and arrays
macro obj {
    case $contract var $handle:ident = $obj => {
	var $handle = C.guard(vbl $contract, $obj)
    }
}

var contracts = window['contracts-js'];
setupContracts(contracts)

// still need to parenthesize the function, which kind of makes sense...
//   can we really define associativity? can't really backtrack
vbl (Num or Bool or Str or ((Num)->Str))

// fun (Num or Bool or Str or (Num)->(Str)) -> (Str or Bool)
// function baz (x) { return x; }

// vbl [Num, Str]

// vbl (Str or Str, ? Num, (Bool, Num) -> (Str or Bool), [Num, Str], Num)

// fun (Num, {x: (Num) -> Str | 
//     pre: !(x) -> {return x.a > 10;}, 
//     post: !(x) -> {return x.a > 20}
//      }) ==> (Str or Num)
// function baz (x, y) { return y; }

// fun (Num, #{name: Str}) -> (Str)
// function batch (x) { return this.name; }

// obj {x: (Num) -> Str | 
//        pre: !(x) -> {return x.a > 10;}, 
//        post: !(x) -> {return x.a > 20} }
// var see = {x: function(y) {return y > 3;}};

// fun (Num, Str or Bool, (Str)->(Str or Num)) -> (Num)
// function baz (x, y, z) { return x; }

// fun (Num or Bool, Str) -> ! (args, result) -> { return args[0] > result; } 
// function foo (x, y) { return x - 1; }

// fun (Num or Str, Str or Bool) -> (Str and Str or Num)
// function bar(x, y) {
//     return y + x;
// }
