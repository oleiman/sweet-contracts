sweet-contracts
===============

A collection of sweet.js macros that provide contract support for JavaScript! Inspired and motivated by [contracts.coffee](http://www.disnetdev.com/contracts.coffee). Powered by [contracts.js](http://disnetdev.com/contracts.js/). Made possible by [sweet.js](http://sweetjs.org).

###Let's start simple...

Try decorating a regular old JavaScript function with a contract:

    fun (Num) -> Num
    function dbl(n) {
        return n + n;
    }

So what happens if we call `dbl` incorrectly?

    > dbl("qux");
    Error: Contract violation: expected <Num>, 
    actual: "qux"
    Value guarded in: docs.js:3:16 (value) 
    -- blame is on: sandbox_exp.js:3:16 (caller)
    Parent contracts:
    (Num) -> Num 

Awesome! How about objects and arrays?

    obj { 
          name: Str,
          age:  Num
        }
    var person = { name: Alyssa P. Hacker, age: 23 };

    arr [Str, Num...]
    var scores = ['Bo', 92, 78, 84, 95, 106];

And don't worry, all that whitespace is totally optional. Sweet.js, the macro engine upon which sweet-contracts is based, ignores it. Of course, we can do more complicated things with our contracts:

    fun ({name: Str, age: Num}, [Str, Num...]) -> (Num or Bool)
    function avg_score(person, scores) {
        var tmp;
        if (person.name !== scores[0]) {
            return false;
        }
        tmp = scores.slice(1).reduce(function(a,b) { 
            return a + b; 
        });
        return (tmp / (scores.slice(1).length));
    }

You're not restricted to a set of predefined contract combinators, either. Defining your own is as simple as writing a suitable predicate function.

    var Even = bang (x) { return x % 2 === 0; }, 'Even'
    var Odd  = bang (x) { return x % 2 !== 0; }, 'Odd'

That goofy bang syntax is a result of a current limitation of the macro engine. This will get cleaned up soon.

Keep in mind that slapping a contract on your function is not the magic bullet for programming in dynamic languages. The onus is still on you to write semantically meaningful code, but sweet-contracts aims to lighten your load a bit.

###Installation and Dependencies

To be fleshed out...

###Functions

Basic functions:

    fun (Num) -> Num
    function f(x) { return x; }

Multiple arguments:
   
    fun (Num, Str, Bool) -> Num
    function f(n, s, b) { /*body*/ }

Optional arguments:

    fun (Num, Str, Bool?) -> Num
    function f(n, s, b) { /*body*/ }

As usual, optional arguments should come at the end of the argument list.

We also have higher order functions:

    fun ((Num) -> Bool, Num) -> Bool
    function f(g, n) { /*body*/ }

Functions that *cannot* be used with `new`:

    fun (Num) --> Num
    function f(n) { /*body*/ }

    var g = f(23);      // oops!
    var g = new f(23);  // funky!

And function that *must* be used with `new`:

    fun (Num) ==> Num
    function f(n) { /*body*/ }

    var g = f(23);      // oops!
    var g = new f(23);  // funky!

We also get dependent functions:

    fun (Num) -> !(result, args) -> { result > args[0]; }
    function inc(n) { return n + 1; }

After the function is evaluated, its result and original argument list are passed into the dependent function. If its return value is truthy, then everything is fine. Otherwise, we get a contract violation exception.

The `this` contract allows us to ensure that, when a function is called, `this` matches the given contract:

    fun (Str) -> Str #{name: Str}
    function f(s) { /*body*/ }

    var no = { handle: "wotan", f: f};
    var ok = { name: "onan", f: f};
    
    no.f(s);            // alright you primitive screwheads...
    ok.f(s);            // groovy

###Objects

As you might expect, object properties can be wrapped in various contracts:

    obj {
          a: Str,
          b: Num,
          f: (Num) -> Num
        }
    var o = {a: "bob", b: 23, f: function (x) -> x + 1 };

But take note that object (and array) contracts are not checked until the object it encloses is referenced. That is, you could assign a contract-violating object to `o`, but you won't get your error until you reference the field which violates the contract.

Nested objects and optional properties:

    obj {
          ob: { a: Str },
          a: Num,
          b: ?Str
        } 
    var o = { ob: { a: "baz" }, a: 23 }; 

How about a recursive object?

    obj {
          a: Num,
          b: Self,
          c: (Num) -> Self,
          inner: { y: Bool, z: Self }
        }
    var o = { /*stuff*/ };

The `Self` contract is built into contracts.js and refers to the closest enclosing object. Remember that the `Self` contract requires only a reference to a similar object, not a reference to precisely the same object. This is probably obvious (we're all familiar with the concept of an infinite recursion...), but it's worth noting anyway.

Now let's take a look at objects with functions which have pre and post conditions:

    obj {
          a: Num,
	 f: (Num) -> Num | 
 	     pre: !(o) -> { return o.a > 10; }
              post: !(o) -> { return o.a > 20; }
        }
    var o = { a: 23, f: function (x) { this.a = this.a + x; } };

The pre and post conditions get called with the object to which the function belongs.

Object invariants are being put off on account of some bugs in the contracts.js library.

###Arrays

Basic arrays:

    arr [Num, Str, [Bool, Num]]
    var a1 = [1, '2', [true, 23]];

It's worth noting that the outer array contract only covers the first three elements of 	`a`, and the inner array contract covers only the first two elements of `a[2]`. The following array, covered by the same contract, would be just as suitable:

    var a2 = [1, '2', [true, 23, "qux"], "whatever"];

