// tests surrounding objects/arrays
//  -- both as arguments and standalone (objects anyway...)

var contracts = window['contracts-js'];
setupContracts(contracts)

// function which takes an object parameter
fun ((foo: Str,
      baz: (quux: (Str -> (noisy: Str))),
      jazz: Num)) -> (quux: (Str -> (noisy: Str)))
function get(o) {
    return {quux: function (str) { 
	             return {noisy: str}; 
                  }
	   };
}

// def get(o:(foo => Str, 
// 	   baz => (quux => (Str -> (noisy => Str))), 
// 	   jazz => Num)):(quux => (Str -> (noisy => Str))) {
//     return {quux: function (str) {return {noisy: str};}};

// this test is broken after some recent change to contracts.js
//    return o['baz'];
//}

// SUCCESS
var o = { foo: 'bar', baz: {quux: function (str) {return {noisy: str};}}, 'jazz': 23 };
document.writeln(get(o)['quux']('neighbors')['noisy']);

// FAIL
// var q = { foo: 'jazz', baz: 'tux', 'jazz': 'krooks' };
// document.writeln(get(q));

//function which takes a basic array parameter
fun ([Str, Num], Num) -> Str
function index(a, b) {
    return a[b];
}

// def index(a:[Str, Num], b:Num):Str {
//     return a[b];
// }

//SUCCESS
document.writeln(index(['foo', true], 0));
// // note that passing [Str, Num] to contracts.arr guards \
// // only the first two elements in the array
document.writeln(index(['jazz', true, 23], 0)); 

//FAILURE - or it should, anyway. This feature is not working as expected
//document.writeln(index([], 0));

fun ([Str...], Num) -> Str 
function index2(a, b) {
    return a[b];
}

// def index2(a:[Str...], b:Num):Str {
//     return a[b];
// }

//SUCCESS
document.writeln(index(['foo', 'bar', 'baz', 'quux'], 2));

//FAILURE
// document.writeln(index([23, 'bar', 'baz'], 0));

// interesting point about the semantics of the array combinators:
// the contract doesn't fail until you try to access a particular
//    element of the array. So, the following passes just fine:
document.writeln(index([23, 'bar', 'baz'], 2));

// optional object property
fun ((a: Num, b: (?Str), c: (qux: Str))) -> Str
function optP(o) {
    return o.c.qux;
}

//SUCCESS
optP({a: 23, c: {qux: 'like a duck'}});

// FAILURE
// optP({a: 23});
