const app = require('./app');

var requestBody = {
    url: 'https://4r2pigpql5.execute-api.us-east-1.amazonaws.com/skinner/financial/dwolla',
    secret: 'sandbox-secret',
  };

const appToken = app.token.then((token) => {
    console.log(`appToken: ${JSON.stringify(token, null, 2)}`);
    return token.post('webhook-subscriptions', requestBody)
        .then((result) => {
            console.log(`post result: ${JSON.stringify(result, null, 2)}`);
        });
});

// const result = app.token.post('webhook-subscriptions', requestBody)
//     .then((result) => {
//         console.log(`result: ${result}`);
//     });