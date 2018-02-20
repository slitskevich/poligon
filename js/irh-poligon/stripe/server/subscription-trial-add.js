var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

stripe.subscriptions.update(
  "sub_C3v21oYvh5SR0A",
  { trial_end: 1514937600,
    prorate: false },
  function(err, subscription) {
    console.log(`error: ${JSON.stringify(err, null, 2)}`);
    console.log(`result: ${JSON.stringify(subscription, null, 2)}`);
  }
);
