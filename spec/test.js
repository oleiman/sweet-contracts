// JSNOOB: can't figure out the correct idiom for including my 
//         macros in another js file, so I'm leaving the tests
//         here, for now.

//  let the system know where the contracts object is hanging out
setupContracts(contracts)
bang Num2 (x) -> { return typeof(x) === 'number' }
bang Obj (x) -> { return typeof(x) === 'object' }

// parameter and return value contract
def foo(x:Num2):Num2 {
    return x + x;
}
// SUCCESS
document.writeln(foo(3));
// FAIL
// document.writeln(foo('3'));

// multiple parameter contracts
def bar(x:Num2, y:Str):Str {
    return y;
}
// SUCCESS
document.writeln(bar(5, 'five'));
// FAIL
// document.writeln(bar('five', 5));

// contract to return a function
def qux(y:Str):(Num2 -> Str) {
    return function (z) { return y; }
}
// SUCCESS
document.writeln(qux('quxer')(7));
// FAIL
// document.writeln(qux('quxer')('seven'));

// contract for a function that returns a function whose
// parameter is another function
def jux(y:Num):((Num->Str)->Str) {
    return function(z) { return z(y); }
}
// SUCCESS
document.writeln(jux(2)( 
    function(n){
	return 'joboxer'.charAt(n);
    })
);
// FAIL - but not in the way that I would like...
//  document.writeln(jux(2)(
//      function(s){
//  	return s;
//      })
//  );

// function which takes an object parameter
def get(o:Obj, f:Str):Str {
    return o[f];
}
var obj = { foo: 'bar', baz: 'quux', 'jazz': 23};
// SUCCESS
document.writeln(get(obj, 'baz'));
// FAIL
//  document.writeln(get(obj, 'jazz'));

