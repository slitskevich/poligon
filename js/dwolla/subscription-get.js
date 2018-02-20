const app = require('./app');

const webhookSubscriptionUrl = 'https://api-sandbox.dwolla.com/webhook-subscriptions/efdb350c-cf97-47e3-ab01-1d9d6f2adf7d';

const result = app.token
    .then((token) => {
        return token.get(webhookSubscriptionUrl);
    })
    .then((subscription) => {
        console.log(`subscription: ${JSON.stringify(subscription, null, 2)}`);
    });