
//  let the system know where the contracts object is hanging out
var contracts = window['contracts-js'];
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

// FAIL - but not in the most intuitive way...
//  document.writeln(jux(2)(
//      function(s){
//  	return s;
//      })
//  );

// function which takes an object parameter
def get(o:(foo => Str, 
	   baz => (quux => (Str -> (noisy => Str))), 
	   jazz => Num)):(quux => (Str -> (noisy => Str))) {
    return {quux: function (str) {return {noisy: str};}};
// this test is broken after some recent change to contracts.js
//    return o['baz'];
}
// SUCCESS
var o = { foo: 'bar', baz: {quux: function (str) {return {noisy: str};}}, 'jazz': 23 };
document.writeln(get(o)['quux']('neighbors')['noisy']);

// FAIL
// var q = { foo: 'jazz', baz: 'tux', 'jazz': 'krooks' };
// document.writeln(get(q));
