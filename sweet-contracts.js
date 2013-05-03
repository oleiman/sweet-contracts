macro setupContracts {
    case ($loc) => {
	var C = $loc;
    }
}

macro opt {
    case $type => {
	C.opt($type)
    }
}

macro vbl {
    case ($p_type -> $ret_type) => {
	C.fun(vbl $p_type, vbl $ret_type)
    }
    case ($($key => $type) (,) ...) => {
	C.object({$($key: (vbl $type),) ...})
    }
    case [$type (,) ...] => {
	C.arr([(vbl $type) (,) ...])
    }
    case ($comb ?) => {
	C.opt(C.$comb)
    }
    case (! ($args:ident, $result:ident) -> $check:expr) => {
	function ($args) { 
    	    return C.check(
		function ($result) 
	            $check, 'foobar')
	}
    }
    case $comb => {
	C.$comb 
    }
    // bugs out when I try to use ellipses. 
    // Matches this pattern all the time
    case [$type &] => {
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

var contracts = window['contracts-js'];
setupContracts(contracts)
//bang Dep (result, args) -> { result > args[0]; }

def inc (x:Num):(!(args, result) -> { return result > args[0]; }) {
//(function (result) { result > args[0]; })) {
    return x + 1;
}

document.writeln(inc(7));
