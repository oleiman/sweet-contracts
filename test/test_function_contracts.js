var contracts = window['contracts-js'];
setupContracts(contracts)

var server = "server";
var client = "client";

module("Function Contracts");

test("checking id", function() {
    fun (Num) -> Num
    function id (x) {
	return x;
    }
    ok(id(3));
    raises(function() { id("foo"); });
});

test("multiple args for function contracts", function() {
    fun (Num, Str, Bool) -> Num
    function f1(a, b, c) { 
	return a + 1; 
    }

    fun (Num, Str, Bool) -> Str
    function f2(a, b, c) {
	return b + "fu";
    }

    fun (Num, Str, Bool) -> Str
    function f3(a, b, c) {
	return c;
    }

    equal(f1(22, "test", false), 23);
    equal(f2(22, "test", false), "testfu");
    raises(function() { f1("test", 22, false); }, "bad client");
    raises(function() { f1("22", test, false); }, "bad server");
});

    
