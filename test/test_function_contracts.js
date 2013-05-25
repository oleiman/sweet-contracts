var contracts = require('contracts-js');
var expect = require('expect.js');

setupContracts(contracts)

var server = "server";
var client = "client";

describe("basic functions", function() {
    fun (Num, Str, Bool) -> (Str)
    function bar (x, y, z) {
	if (y === '2') {
	    return y;
	}
	return z;
    }
    
    it("should handle function contracts with multiple combinators", function() {
	expect(bar(1,'2',true)).to.be('2');
    });
    
    it("should fail on argument contract violations", function() {
	expect(function() { bar(1,2,true) }).to.throwException();
    });

    it("should fail on return contract violations", function() {
	expect(function() { bar(1,'3',true) }).to.throwException();
    });

    fun (Even or Odd or Str, (Num or Str)->Bool) -> (Num and Even)
    function jazz(x, p) {
	var even;
	if (p(x)) {
	    even = parseInt(x) + 0;
	} else { 
	    even = parseInt(x) + 1;
	}
	return even;
    }

    it("should handle contract operators and higher order functions", function() {
	expect(jazz(3, function(x){return x%2 === 0;})).to.be(4);
	expect(jazz('4', function(x){return x%2 === 0;})).to.be(4);
    });
    
   it("should fail at appropriate times", function() {
       // argument disjunction violated
       expect(function(){ 
	   jazz(true, function(x){return x%2 === 0;})
       }).to.throwException();

       // higher order argument contract violated
       expect(function(){ 
	   jazz(3, function(x){return x + 's'})
       }).to.throwException();

       // return contract violated
       expect(function(){ 
	   jazz(3, function(x){return x%2 === 1;})
       }).to.throwException();
   });

    fun (Num, ?Str) -> (Num)
    function opt (x,y) {
	if (typeof(y) ==='undefined') {
	    return x;
	}else {
	    return parseInt(y);
	}
    }
    
    it("should support optional argument contracts", function() {
	expect(opt(3)).to.be(3);
	expect(opt(6, '3')).to.be(3);
    });
});
