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

// higher order function
def applyit(f:(Num2->Str), n:Num):Str {
    return f(n);
}

//SUCCESS
document.writeln(applyit(function(n) { 
    return n + '0';
}, 23));

// function which returns a higher order function
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
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
=======
=======
>>>>>>> Stashed changes
// try colons again!!!
// BUG: when returning o['baz'] my contract claims that the 'quux'
//      field is missing, which it clearly is not
def get(o:(foo => Str, 
	   baz => (quux => (Str -> (noisy => Str))), 
	   jazz => Num)):(quux => (Str -> (noisy => Str))) {
    return {quux: function(s) { return {noisy: s}; }};
//     return o['baz'];
}
// SUCCESS
var o = { foo: 'bang', baz: {quux: function (str) {return {noisy: str};}}, 'jazz': 23 };
//document.writeln(o['baz']['quux']('neighbors')['noisy']);
document.writeln(get(o)['quux']('neighbors')['noisy']);

// FAIL
// var q = { foo: 'jazz', baz: 'tux', 'jazz': 'krooks' };
// document.writeln(get(q));

//function which takes a basic array parameter
def index(a:[Str, Bool], b:Num):Str {
    return a[b];
}

//SUCCESS
document.writeln(index(['foo', true], 0));
// // note that passing [Str, Num] to contracts.arr guards \
// // only the first two elements in the array
document.writeln(index(['jazz', true, 23], 0)); 

//FAILURE - or it should, anyway. This feature is not working as expected
//document.writeln(index([], 0));

def index2(a:[Str &], b:Num):Num {
    return a[b];
}

//SUCCESS
document.writeln(index(['foo', 'bar', 'baz', 'quux'], 2));

//FAILURE
document.writeln(index([23, 'bar', 'baz'], 0));
// interesting point about the semantics of the array combinators:
// the contract doesn't fail until you try to access a particular
//    element of the array. So, the following passes just fine:
document.writeln(index([23, 'bar', 'baz'], 2));

// This is taken directly from the contracts.js test suite
// and doesn't throw an error. Something is wonky in contracts...
// var ar = C.guard(C.arr([C.Str, C.Bool]), [false, "foo", 42]);
// document.writeln(ar[0]);

//optional arguments/obj properties (?) , dependent functions (bang), ctor contracts, th
//is contract, recursive objects (see self contract), pre/post (use '|' to signal), 
//object invariants, and/or combinators
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
