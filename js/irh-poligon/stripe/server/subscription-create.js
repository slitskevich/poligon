const Promise = require('bluebird');
var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

const result = Promise.resolve().then(() => stripe.subscriptions.create({
  customer: "cus_C1gOBrGlfatnvv",
  items: [
    {
      plan: "d regular",
      quantity: 0,
    },
  ],
})).then((result) => {
  console.log(`result: ${JSON.stringify(result, null, 2)}`);

  return result;
}).catch((error) => {
  console.log(`error: ${JSON.stringify(err, null, 2)}`);
});

// 1514889642 sub_C3v21oYvh5SR0A
// si_C3v2ArXoMp51yS