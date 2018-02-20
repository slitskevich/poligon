var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

stripe.subscriptions.update(
  "sub_C3v21oYvh5SR0A",
  { 
    prorate: true,
    // proration_date: 1514579649,
    quantity: 1 },
  function(err, result) {
    console.log(`error: ${JSON.stringify(err, null, 2)}`);
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
  }
);
