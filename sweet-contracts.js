macro setupContracts {
    case ($loc) => {
	var C = $loc;
    }
}

macro check {
    case (function ($arg:ident) { $check ... }, $name:lit) => {
	C.check(function ($arg) { $check ... }, $name)
    }
    
    case ($handle:ident, function ($arg:ident) { $check ... }, $name:lit) => {
	var $handle = C.check(function ($arg) { $check ... }, $name)
    }
}

// TODO: add invariant sytax
//       even though it doesn't work (on account of contracts.js)
// TODO: figure out "shift/reduce" like error with operators mixed with functions
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
    case ($p_type -> $ret_type, $rest ...) => {
    	vbl ($p_type -> $ret_type), vbl ($rest ...)
    }
    case {$key $[:] $rest ...} $[|] invariant $[:] !($arg:ident) -> {$check ...} => {
    	C.object({ $key: vbl ($rest ...) }, 
    		 { invariant: function($arg) { $check ... } })
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
    // also, note that the '@' symbol is 'not allowed'
    // the 'this' parameter now comes "after" the function contract
    case ($[#] $this) => {
	vbl ($this)
    }
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
    case ($comb, $rest ...) => {
	vbl $comb, vbl ($rest ...)
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
    case [$arr ...] => {
    	C.arr([vbl ($arr ...)])
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
    case ($comb $[...]) => {
    	C.___(vbl ($comb))
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
    case $params -> $ret function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl $ret),
    	    function $args $body);
    }
    
    // an experiment. does this make sense for 'this' contract syntax
    case $params -> $ret $[#] $this function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl $ret, {this: vbl $this}),
    	    function $args $body);
    }
    case $params -> ! ($argl:ident, $result:ident) -> {$check ...} function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl (! ($argl, $result) -> {$check ...})),
    	    function $args $body);
    }
    case $params -> $ret $[#] $this var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl $ret),
    	    $def);
    }
    case $params -> ! ($argl:ident, $result:ident) -> {$check ...} var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl (! ($argl, $result) -> {$check ...})),
    	    $def);
    }

    // TODO: decide whether it makes sense to have a 'this' contract on callOnly/newOnly

    // no new
    case $params --> $ret function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl $ret, {callOnly: true}),
    	    function $args $body);
    }
    case $params --> ! ($argl:ident, $result:ident) -> {$check ...} function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl (! ($argl, $result) -> {$check ...}), {callOnly: true}),
    	    function $args $body);
    }
    case $params --> $ret var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl $ret, {callOnly: true}),
    	    $def);
    }
    case $params --> ! ($argl:ident, $result:ident) -> {$check ...} var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl (! ($argl, $result) -> {$check ...}), {callOnly: true}),
    	    $def);
    }

    // only new
    case $params ==> $ret function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl $ret, {newOnly: true}),
    	    function $args $body);
    }
    case $params ==> ! ($argl:ident, $result:ident) -> {$check ...} function $handle $args $body => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl (! ($argl, $result) -> {$check ...}), {newOnly: true}),
    	    function $args $body);
    }
    case $params ==> $ret var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl $ret, {newOnly: true}),
    	    $def);
    }
    case $params ==> ! ($argl:ident, $result:ident) -> {$check ...} var $handle = $def:expr => {
    	var $handle = C.guard(
    	    C.fun([vbl $params], vbl (! ($argl, $result) -> {$check ...}), {newOnly: true}),
    	    $def);
    }
}

// double duty objects and arrays
macro obj {
    case $contract var $handle:ident = $obj => {
	var $handle = C.guard(vbl $contract, $obj);
    }
    case $contract $[|] invariant $[:] ! ($var:ident) -> { $check ... } var $handle:ident = $obj => {
        var $handle = C.guard(vbl $contract | invariant: !($var) -> { $check ... }, $obj);
    }
}

macro arr {
    case $contract var $handle:ident = $arr => {
	var $handle = C.guard(vbl $contract, $arr)
    }
}

// var contracts = window['contracts-js'];
// setupContracts(contracts)
