var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

stripe.subscriptions.update(
  "sub_C1j6NgzsUt3xb8",
  { trial_end: 1514470800,
    proration_date: 1514384400 },
  function(err, subscription) {
    console.log(`error: ${JSON.stringify(err, null, 2)}`);
    console.log(`result: ${JSON.stringify(subscription, null, 2)}`);
  }
);
// stripe.subscriptions.create({
//   customer: "cus_C1gOBrGlfatnvv",
//   trial_end: 1516838400,
//   items: [
//     {
//       plan: "x-regular",
//       quantity: 0,
//     },
// ],
// }, function(err, subscription) {
//     console.log(`error: ${JSON.stringify(err, null, 2)}`);
//     console.log(`customer data: ${JSON.stringify(subscription, null, 2)}`);
// });