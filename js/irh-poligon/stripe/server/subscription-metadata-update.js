var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

stripe.subscriptions.update("sub_C6v3ydD4RND98Q",
{
  metadata: {
    "billingStart": "10",
  },
},
  function(err, result) {
    console.log(`error: ${JSON.stringify(err, null, 2)}`);
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
  }
);
