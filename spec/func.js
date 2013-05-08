//tests for basic and higher order functions

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

