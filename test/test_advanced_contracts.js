var contracts = require('contracts-js');
var expect = require('expect.js');

setupContracts(contracts)

var server = "server";
var client = "client";

describe("dependent function contracts", function() {
    fun (Str, Num) -> !(args, result) -> { return result > args[1]; }
    function strNum(x, y) {
	return parseInt(x);
    }
    it("should appply a predicate to function return values", function() {
	expect(strNum('5',4)).to.be.ok();
	expect(function() {strNum('4',5)}).to.throwException();
    });

});

describe("newOnly functions", function() {
    fun (Str, Num) ==> {name: Str, number: Num}
    function Date(name, number) {
	return {name: name, number: number};
    }

    it("should only be callable with the 'new' keyword", function() {
	expect(new Date('Jenny', 8675309)).to.eql({name: 'Jenny', number: 8675309});
	expect(function() {Date('Jenny', 8675309);}).to.throwException();
    });
});

describe("callOnly functions", function() {
    fun (Str, Num) --> (Bool)
    function callMe(name, number) {
	if (name === 'Jenny' &&
	    number === 8675309) {
	    return true;
	} else {
	    return false;
	}
    }

    it("should only be callable *without* the 'new' keyword", function() {
	expect(callMe('Harold', 7772323)).to.be(false);
	expect(function() {var yee = new callMe('Jenny', 8675309);}).to.throwException();
    });
});

describe("object member functions with pre/post conditions", function() {
    obj {a: Num,
	 b: (Num)->Num |
	     pre:  !(o) -> { return o.a > 10; },
	     post: !(o) -> { return o.a > 20; }
	 }
    var ppo = {a: 12, b: function (x) { return this.a += x; } };

    it("should pass if the conditions are met", function() {
	expect(ppo.b(10)).to.be(22);
    });
    
    it("should fail if the conditions are violated", function() {
	// precondition
	ppo.a = 8;
	expect(function() {ppo.b(10)}).to.throwException();

	// postcondition
	ppo.a = 10;
	expect(function() {ppo.b(9)}).to.throwException();
	
    });

    //NB: As noted in the docs, object invariants don't work for now. 
    //    This is due to a bug in the underlying contracts.js library
    // obj {a: Num,
    // 	 b: (Num)->Num |
    // 	     pre:  !(o) -> { return o.a > 10; },
    // 	     post: !(o) -> { return o.a > 20; }
    // 	} |
    //      invariant: !(o) -> { 
    // 	     return o.a > 0 && o.a < 100; 
    // 	 }
    // var invo = {a: 12, b: function (x) { return this.a += x; } };
    
    // it("should fail if the invariant is violated", function() {
    // 	expect(function() {inv.f(90)}).to.throwException();
    // });

});

describe("functions with a 'this' contract", function() {
    // note that just sticking an object at the end of the param list
    // does not a 'this' contract make...
    fun (Num) -> Str #{name: Str}
    function fail (n) {
    	return Array(n).join(this.name);
    }

    thing1 = {name: "Wat", qux: fail};
    thing2 = {only: "Bat", qux: fail};

    it("should require that the calling object matches the contract", function() {
    	expect(thing1.qux(4)).to.equal("WatWatWat");
	expect(function() {thing2.qux(4)}).to.throwException();
    });
});

    
