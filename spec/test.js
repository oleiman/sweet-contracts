//  let the system know where the contracts object is hanging out
var contracts = window['contracts-js'];
setupContracts(contracts)
bang Num2 (x) -> { return typeof(x) === 'number' }
bang Obj (x) -> { return typeof(x) === 'object' }

//parameter and return value contract
fun (x:Num2) -> Num2
function foo(x) {
    return x + x;
}

// def foo(x:Num2):Num2 {
//     return x + x;
// }

// SUCCESS
document.writeln(foo(3));
// FAIL
// document.writeln(foo('3'));

// optional parameter
fun (x:Num2, y:(?Str)) -> Num 
function bar(x, y) {
    return x;
}

// def bar(x:Num2, y:(?Str)):Num {
//     return x;
// }

// SUCCESS
document.writeln(bar(5, 'five'));
document.writeln(bar(5));
// FAIL
// document.writeln(bar('five', 5));

// contract to return a function
fun (y:Str) -> (Num2 -> Str)
function qux(y) {
    return function (z) { return y; }
}

// def qux(y:Str):(Num2 -> Str) {
//     return function (z) { return y; }
// }

// SUCCESS
document.writeln(qux('quxer')(7));

// FAIL
// document.writeln(qux('quxer')('seven'));

// higher order function
fun (f:(Num2->Str), n:Num) -> Str 
function applyit(f, n) {
    return f(n);
}

// def applyit(f:(Num2->Str), n:Num):Str {
//     return f(n);
// }

//SUCCESS
document.writeln(applyit(function(n) { 
    return n + '0';
}, 23));

// function which returns a higher order function
fun (y:Num) -> ((Num->Str)->Str)
function jux(y) {
    return function(z) { return z(y); }
}

// def jux(y:Num):((Num->Str)->Str) {
//     return function(z) { return z(y); }
// }

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
fun (o: (foo: Str,
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
fun (a:[Str, Num], b:Num) -> Str
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

fun (a:[Str...], b:Num) -> Str 
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

// dependent function contract
fun (x:Num) -> (!(args, result) -> { return result > args[0]; })
function inc(x) {
    return x + 1;
}

// def inc (x:Num):(!(args, result) -> { return result > args[0]; }) {
//     return x + 1;
// }

// SUCCESS
document.writeln(inc(7));

// //we get standalone objects pretty much for free
obj (a: Num, b: Str) 
var q = {a: 23, b: 'quux'};

//object with function that has pre and post conditions
// worth noting that, at this point, object must have both
obj (a: Num, 
     b: ((Num -> Num) |
        pre: (!(o) -> o.a > 10)
        post: (!(o) -> o.a > 20)))
var ppo = {a: 12, b: function (x) {return this.a = this.a + x} };

//SUCCESS
ppo.b(12);

//FAILURE
// ppo.b(5);

//optional obj properties (?), ctor contracts, this contract, 
//recursive objects (see self contract), pre/post (use '|' to signal), 
//object invariants, and/or combinators
