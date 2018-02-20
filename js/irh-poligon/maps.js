var map = {
    EUR: 0.01,
    USD: 0.8
}
var rewards = [];
Object.keys(map).forEach(function(currency) {
  rewards.push({amount: map[currency], currency: currency});
});
// console.log(rewards);

var m1 = new Map();
m1["EUR"] = 5.0;
var anotherResult = Array.from(m1, (amount, currency) => {
  console.log("amount: ", amount);
  return {currency, amount};
});
// console.log(anotherResult);

var rewards = { EUR: '0.8' };
var result = Array.from(rewards, (entry) => {
  return {currency: entry[0], amount: entry[1]};
});
console.log("result: ", result);

