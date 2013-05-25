//TODO: Self contracts for objects, although this is just another combinator...
//           does this really need testing?

var contracts = require('contracts-js');
var expect = require('expect.js');

setupContracts(contracts)

var server = "server";
var client = "client";

// TODO: make it so the function in a disjunction doesn't have to be in parens
describe("functions with objects", function() {
    fun ({x: Str,
	  y: {foo: (Str) -> {bar: Str}},
	  z: ?Num}, Str) -> (Num or ((Str) -> {bar: Str}))
    function baz(o,r) {
	var t = o[r];
	if (typeof(t) === 'object'){
	    return o[r].foo;
	} else if (typeof(t) === 'undefined') {
	    return 23;
	} else {
	    return o[r];
	}
    }
    
    var obj1 = {x: 'foo', y: {foo: function(z) { return {bar: z}; }}, z: 3};
    var obj2 = {x: 'foo', y: {bar: 23}, z: 3};
    var obj3 = {x: 'foo', y: {foo: function(z) { return {bar: z}; }}};
    var obj4 = {s: 'foo', z: 23};
    
    it("should handle object contracts as args and return vals", function() {
	expect(baz(obj1, 'y')('bar')).to.eql({bar: 'bar'});
    });

    it("should fail when arg/return object contract is violated", function() {
	expect(function() { 
	    baz(obj2, 'y') 
	 }).to.throwException();
	
	// missing object property
	expect(function() { 
	    baz(obj4, 'y') 
	}).to.throwException();
    });

   // noticing that these basically never fail, anyway
   it("should handle optional object properties", function() {
       expect(baz(obj3, 'z')).to.be(23);
   });
});

describe("functions with arrays", function() {
    fun ([Str,Num], Bool) -> (Num or Str)
    function sel(a,s) {
	if (s) {
	    return a[0];
	} else {
	    return a[1];
	}
    }
    it("should pass when the array contract is met", function() {
	expect(sel(['1',2],true)).to.be('1');
	//note that the contract only guards the first two elements
	expect(sel(['1',2,3,true,{a: 'qux'}], false)).to.be(2);
    });

    it("should fail when the array contract is violated", function() {
	expect(function(){sel([1,'2'])}).to.throwException();
    });

    fun ([Str or Bool, Bool ...]) -> (Str or Bool)
    function arry(a, i) {
	return a[i];
    }
    it("should handle 'arbitrarily many of...' contracts", function() {
	expect(arry(['foo', true, false, true],3)).to.be(true);
    });

    it("should fail when appropriate", function() {
	expect(function() {arry(['foo', true, false, 'boo'],3)}).to.throwException();
    });
});

describe("standalone objects", function() {
    obj {a: Str, b: (Num)->Bool}
    var obj5 = { a: 'foo', 
		 b: function (x) { return x === 3 ? true : 'foo'; }
	       };

    it("should be referenced successfully when the contract is met", function() {
    	expect(obj5.a).to.eql('foo');
    	expect(obj5.b(3)).to.be(true);
    });

    it("should fail when the contract is violated", function() {
	expect(function() {obj5.a = 23}).to.throwException();
	expect(function() {obj5.b(4)}).to.throwException();
    });
});

describe("standalone arrays", function() {
    arr [Num, Str, Bool ...]
    var a = [1, 'foo', true, false, true];
    
    it ("should be referenced successfully when the contract is met", function() {
    	expect(a[0]).to.be(1);
    	expect(a[1]).to.be('foo');
    	expect(a[3]).to.be(false);
    });

    it ("should fail when the contract is violated", function() {
    	expect(function() {a[0] = '1'}).to.throwException();
    	expect(function() {a[4] = 'true'}).to.throwException();
    });
});
