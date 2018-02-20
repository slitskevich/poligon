var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

stripe.subscriptionItems.del(
  "si_C2RKdUE64n7CKg",
  {
    proration_date: 1514634895
  },
  function(err, result) {
    console.log(`error: ${JSON.stringify(err, null, 2)}`);
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
  }
);
