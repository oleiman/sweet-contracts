// tests for advanced contract features
//  -- dependent functions
//  -- pre/post conditions

var contracts = window['contracts-js'];
setupContracts(contracts)

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

