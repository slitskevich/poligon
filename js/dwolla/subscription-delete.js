const app = require('./app');

const webhookSubscriptionUrl = 'https://api-sandbox.dwolla.com/webhook-subscriptions/f61b8efe-cefa-4673-970b-f4696c9adae2';

const result = app.token
    .then((token) => {
        return token.delete(webhookSubscriptionUrl);
    })
    .then((subscription) => {
        console.log(`subscription: ${JSON.stringify(subscription, null, 2)}`);
    });