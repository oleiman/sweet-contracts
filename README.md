sweet-contracts
===============

A collection of sweet.js macros that provide contract support for JavaScript! Inspired and motivated by [contracts.coffee](http://www.disnetdev.com/contracts.coffee). Made possible by [sweet.js](http://sweetjs.org). 

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

    var Even = bang (x) { return x % 2 === 0; }
    var Odd  = bang (x) { return x % 2 !== 0; }

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

    



    