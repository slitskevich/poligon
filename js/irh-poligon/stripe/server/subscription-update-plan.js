var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

const subscriptionId = "sub_C7IqGlgfWTAAAk";

const result = stripe.subscriptions.retrieve(subscriptionId)
  .then((subscription) => {
    // console.log(`subscription: ${JSON.stringify(subscription, null, 2)}`);
    const items = subscription.items.data;
    console.log(`items: ${JSON.stringify(items, null, 2)}`);
    let quantity = 0;
    const update = [];
    for (var i = 0; i < items.length; i += 1) {
      const itemPlan = items[i].plan;
      console.log(`plan: ${JSON.stringify(itemPlan, null, 2)}`);
      if (items[i].plan.id === "irh-initial") {
        update.push({
          id: items[i].id,
          deleted: true,
        });
        quantity += items[i].quantity;
      }
    }
    update.push({
      plan: "irh-regular",
      quantity,
    });
    console.log(`update: ${JSON.stringify(update, null, 2)}`);
    return stripe.subscriptions.update(subscriptionId, {
      items: update,
    });
  })
  .then((result) => {
    console.log(`result: ${JSON.stringify(result, null, 2)}`);
  })
  .catch((error) => {
    console.log(`error: ${error}`);
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
  });