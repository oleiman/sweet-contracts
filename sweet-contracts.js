macro setupContracts {
    case ($loc) => {
	var C = $loc;
    }
}

macro vbl {
    case ($p_type -> $ret_type) => {
	C.fun(vbl $p_type, vbl $ret_type)
    }
    case ($($key => $type) (,) ...) => {
	C.object({$($key: (vbl $type),) ...})
    }
    // array contracts are sort of lame right now.
    // Currently supporting contracts for homogeneous arrays and
    // for arrays whose first n elements fulfill the contract (the rest are not checked)
    case [$type (,) ...] => {
	C.arr([(vbl $type) (,) ...])
    }
    case [$type $[...]] => {
    	C.arr([C.___(vbl $type)])
    }
    case $comb => {
	C.$comb
    }
}

// TODO: we're stuck with 'some arbitrary name' here. This will be
//       fixed when sweet.js gets some new features

macro bang {
    case ($param:ident) -> $body:expr => {
	C.check(function ($param) $body, 'some arbitrary name')
    }
    
    case $name:ident ($param:ident) -> $body:expr => {
	C.$name = C.check(function ($param) $body, 'some arbitrary name')
    }
}

macro def {
    case $handle:ident ($($param:ident : $type) (,) ...) : $ret_type $body
 	=> { 
            var $handle = C.guard(
		C.fun([(vbl $type) (,) ...], vbl $ret_type),
		function ($($param,) ...) $body);
	}
}
