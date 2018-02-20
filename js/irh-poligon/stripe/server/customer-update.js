'use strict';

const stripe = require('stripe')('sk_test_PnoY9V8ai7zusRCxmkhobxK8');
const customerId = 'cus_C6v3V6H0ZV9wH6';

stripe.customers.update(customerId, {
    source: "tok_1BkVZfFOx6MUPCJQgOrpxYGI"
  }, function(err, customer) {
    console.log(`error: ${JSON.stringify(err, null, 2)}`);
    console.log(`customer data: ${JSON.stringify(customer, null, 2)}`);
  });
