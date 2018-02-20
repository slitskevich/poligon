'use strict';

const stripe = require('stripe')('sk_test_PnoY9V8ai7zusRCxmkhobxK8');

stripe.customers.create({
    description: 'Customer for iRH',
    email: 'slava.litskevich@gmail.com',
    source: "tok_1Bdd1aFOx6MUPCJQ7OhsvmOD" // obtained with Stripe.js
  }, function(err, customer) {
    console.log(`error: ${JSON.stringify(err, null, 2)}`);
    console.log(`customer data: ${JSON.stringify(customer, null, 2)}`);
  });
