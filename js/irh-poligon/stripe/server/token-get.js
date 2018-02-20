const Promise = require('bluebird');
var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

const result = Promise.resolve(stripe.tokens.retrieve("tok_1Bdd1aFOx6MUPCJQ7OhsvmOD"))
.then((result) => {
  console.log(`result: ${JSON.stringify(result, null, 2)}`);

  return result;
}).catch((error) => {
  console.log(`error: ${JSON.stringify(err, null, 2)}`);
});