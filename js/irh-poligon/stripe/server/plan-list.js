'use strict';

const Stripe = require('stripe')('sk_test_PnoY9V8ai7zusRCxmkhobxK8');

const plansData = Stripe.plans.list({}, function(err, plans) {
    console.log(`error: ${JSON.stringify(err, null, 2)}`);
    console.log(`plans data: ${JSON.stringify(plans, null, 2)}`);
});
