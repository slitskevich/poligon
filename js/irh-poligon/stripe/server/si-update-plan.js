var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

stripe.subscriptionItems.update(
  "si_C2TWEzjFDerum5",
  {
    plan: "d regular",
    proration_date: 1514646648
  },
  function(err, result) {
    console.log(`error: ${JSON.stringify(err, null, 2)}`);
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
  }
);
