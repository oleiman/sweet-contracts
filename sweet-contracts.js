macro setupContracts {
    case ($loc) => {
	var C = $loc;
    }
}

// by abstracting this out we actually get stuck with *more* parens
macro opt_obj {

    // case ($($key $[:] ! ($arg:ident) -> {$check ...}) (,) ...) => {
    // 	{$($key: function ($arg) {$check ...},) ...}
    // }
    // case ($($key $[:] ! ($arg:ident) -> {$check ...})) this $[:] $obj => {
    // 	{$($key: function ($arg) {$check ...},) ..., this: (vbl $obj)}
    // }
    case ($($key $[:] $type) (,) ...) => {
    	{$($key: (vbl $type),) ...}
    }
}

macro vbl {
    case ($p_type -> $ret_type) => {
	C.fun(vbl $p_type, vbl $ret_type)
    }
// case (($p_type -> $ret_type) $[|] $opts) => {
//     	C.fun([vbl $p_type], vbl $ret_type, opt_obj $opts)
//     }
    // this is kinda nice, but we're still stuck with parenthesized predicates...
    case (($p_type -> $ret_type) $[|] $($key $[:] $opt) (,) ...) => {
    	C.fun([vbl $p_type], vbl $ret_type, {$($key: (vbl $opt),) ...})
    }
    // TODO: find an elegant way to allow a method to have 
    //  pre/post (not both), if possible
    // case (($p_type -> $ret_type) $[|]
    //          pre:  $pre_cond
    //          post: $post_cond) => {
    // 	C.fun([vbl $p_type], vbl $ret_type, {
    // 	    pre: vbl $pre_cond,
    // 	    post: vbl $post_cond})
    // }
    // case (($p_type -> $ret_type) $[|]
    //          pre:  $pre_cond) => {
    // 	C.fun([vbl $p_type], vbl $ret_type, {
    // 	    pre: vbl $pre_cond})
    // }
    // case (($p_type -> $ret_type) $[|]
    //          post: $post_cond) => {
    // 	C.fun([vbl $p_type], vbl $ret_type, {
    // 	    post: vbl $post_cond})
    // }
    case ($($key $[:] $type) (,) ...) => {
	C.object({$($key: (vbl $type),) ...})
    }
    case (($($key $[:] $type) (,) ...) $[|] $pred) => {
	C.object({$($key: (vbl $type),) ...}, 
		 {invariant: vbl $pred})
    }
    case [$type (,) ...] => {
	C.arr([(vbl $type) (,) ...])
    }
    case (? $comb) => {
	C.opt(C.$comb)
    }
    case ($comb1 or $comb2) => {
	C.or(vbl $comb1, vbl $comb2)
    }
    case ($comb1 and $comb2) => {
	C.and(vbl $comb1, vbl $comb2)
    }
    case (! ($arg:ident) -> { $check ... }) => {
	function ($arg) {
	    $check ...
	}
    }
    case (! ($args:ident, $result:ident) -> { $check ... }) => {
	function ($args) { 
    	    return C.check(
		function ($result) { $check ... }, 'foobar')
	}
    }
    case $comb => {
	C.$comb 
    }
    case [$type $[...]] => {
    	C.arr([C.___(vbl $type)])
    }
}

// TODO: we're stuck with 'some arbitrary name' here. This will be
//       fixed when sweet.js gets some new features

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

macro fun {
    case ($type (,) ...) -> $ret_type var $handle:ident = function $args $body => {
	var $handle = C.guard(
	    C.fun([(vbl $type) (,) ...], vbl $ret_type),
	    function $args $body);
    }
    case ($type (,) ...) -> $ret_type function $handle $args $body => {
	var $handle = C.guard(
	    C.fun([(vbl $type) (,) ...], vbl $ret_type),
	    function $args $body);
    }
    // ctor
    case ($type (,) ...) ==> $ret_type var $handle:ident = function $args $body => {
	var $handle = C.guard(
	    C.fun([(vbl $type) (,) ...], vbl $ret_type, {newOnly: true}),
	    function $args $body);
    }
    case ($type (,) ...) ==> $ret_type function $handle $args $body => {
	var $handle = C.guard(
	    C.fun([(vbl $type) (,) ...], vbl $ret_type, {newOnly: true}),
	    function $args $body);
    }
    // no ctor
    case ($type (,) ...) --> $ret_type var $handle:ident = function $args $body => {
	var $handle = C.guard(
	    C.fun([(vbl $type) (,) ...], vbl $ret_type, {callOnly: true}),
	    function $args $body);
    }
    case ($type (,) ...) --> $ret_type function $handle $args $body => {
	var $handle = C.guard(
	    C.fun([(vbl $type) (,) ...], vbl $ret_type, {callOnly: true}),
	    function $args $body);
    }
}

macro obj {
    case $contract var $handle:ident = $obj => {
	var $handle = C.guard(vbl $contract, $obj)
    }
}

var contracts = window['contracts-js'];
setupContracts(contracts)


obj (a: Num, 
     b: ((Num -> Num) |
          pre: (!(o) -> { return o.a > 10; }),
          post: (!(o) -> { return o.a > 20; }),
	  this: (a: Num, b: (Num->Num))))
var ppo = {a: 3, b: function (x) {return this.a = this.a + x;} };
ppo.b(3);

// obj (a: Num, 
//      b: ((Num -> Num) |
//         (pre: (!(o) -> o.a > 10),
//         post: (!(o) -> o.a > 20))))
// var ppo = {a: 12, b: function (x) {return this.a = this.a + x;} };
