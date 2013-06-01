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
 	          pre:  !(o) -> { return o.a > 10; },
              post: !(o) -> { return o.a > 20; }
        }
    var o = { a: 23, f: function (x) { this.a = this.a + x; } };

The pre and post conditions get called with the object to which the function belongs.

Object invariants currently don't work (on account of a bug in contracts.js where undefined is passed into the invariant predicate), but here's the syntax anyway:

    obj {
          a: Num,
          f: (Num) -> Num |
              pre:  !(o) -> { return o.a > 10; },q
              post: !(o) -> { return o.a > 20; }
        } | 
         invariant: !(o) -> { 
             return o.a > 0 && o.a < 100; 
         }
    var o = { a: 42, f: function (x) { this.a = this.a + x; } };

###Arrays

Basic arrays:

    arr [Num, Str, [Bool, Num]]
    var a = [1, '2', [true, 23]];

It's worth noting that the outer array contract only covers the first three elements of 	`a`, and the inner array contract covers only the first two elements of `a[2]`. The following array, covered by the same contract, would be just as suitable:

    var a = [1, '2', [true, 23, "qux"], "whatever"];

Multiple elements of a single type:

    arr [Num...]
    var a = [42, 23, 93, 777, 8];

The `...` operator ensures that the array will contain only `Num`s.

Mixed arrays:

    arr [Bool, Str, Num...]
    var a = [false, "qux", 74, 8, 9]

This requires that the first two elements of the array pass the two single contracts at the beginning. The rest of the elements must be `Num`s. Note that, like optional function parameters, the contract with the `...` operator must be in the last position of the array contract.

###Contract Operators

The `or` contract:

    obj { a: Num or Str }
    var o = { a: 8 }

Here the `o.a` must pass either the `Num` or `Str` contract. Note that since functions and object/array contracts have deferred checking (i.e. the contract is not checked until the function is called/object field is referenced), only one function/object can be used with `or`. 

The `and` contract:

    obj { a: Num and Even }
    var o = { a: 42 }

The `a` property must pass both contracts. Just as with `or`, you can't use multiple function/object contracts with the `and` operator.

It's worth noting that, if you want to use a function contract as an operand, you must enclose it in parentheses. This is a difficulty introduced by the recursive macro definitions used to implement sweet-contracts.

    obj { a: Num or ((Str)->Bool) }
    var o = { a: function(s) { return s === "quuux"; } };

One final thing is that notions of precedence between `and` and `or`, which you might be familiar from Boolean Algebra, are absent from sweet-contracts. In any event, if you want anything more complicated than basic left associativity, you can just use parens.

###Custom Contracts

You can also define your own personal contracts! There are two ways to do this.

Assign a check to a variable:

    var Num = check(function(x) { return typeof(x) === 'number'; }, 'Num');

Or let the `check` macro save you from typing `var` one more time:

    check(Str, function(x) { return typeof(x) === 'string'; }, 'Str');

The final argument to the `check` macro, a string, will server to identify the resulting contract in exceptions resulting from its violation.
