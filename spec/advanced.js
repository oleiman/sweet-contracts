// tests for advanced contract features
//  -- dependent functions
//  -- pre/post conditions

var contracts = window['contracts-js'];
setupContracts(contracts)

// dependent function contract
fun (Num) -> (!(args, result) -> { return result > args[0]; })
function inc(x) {
    return x + 1;
}

// def inc (x:Num):(!(args, result) -> { return result > args[0]; }) {
//     return x + 1;
// }

// SUCCESS
document.writeln(inc(7));

// constructor
fun (Num) ==> (a: Num)
function NumWrapper(n) {
    return {a: n};
}
// not a constructor
fun (Num) --> Num
function numBack(n) {
    return n;
}

// SUCCESS
var intObj = new NumWrapper(23);
var intThing = numBack(23);

// FAILURE
// var intObj = NumWrapper(23);
// var intThing = new numBack(23);

// //we get standalone objects pretty much for free
obj (a: Num, b: Str) 
var q = {a: 23, b: 'quux'};

//object with function that has pre and post conditions
// worth noting that, at this point, object must have both
obj (a: Num, 
     b: ((Num -> Num) |
        pre: (!(o) -> o.a > 10)
        post: (!(o) -> o.a > 20)))
var ppo = {a: 12, b: function (x) {return this.a = this.a + x;} };

obj (a: Num,
     b: ((Num -> Num) |
	 post: (!(o) -> o.a > 20)))
var post = {a: 12, b: function (x) {return this.a = this.a + x;} };

obj (a: Num,
     b: ((Num -> Num) |
	 pre: (!(o) -> o.a > 10)))
var pre = {a: 12, b: function (x) {return this.a = this.a - x;} };

//SUCCESS
ppo.b(10);
post.b(10);
pre.b(3);

//FAILURE
// pre.b(1);
// post.a = post.a - 14;
// post.b(1);
// ppo.a = post.a - 13;
// ppo.b(1);

//object invariants

obj ((x: Num, y: Str) | (!(o) -> o.x > 3))
var spam = {x: 4, y: 'bazqux'};

spam.x = 2;
