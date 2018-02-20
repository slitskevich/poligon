const app = require('./app');

const list = app.token
    .then((token) => {
        return token.get('webhook-subscriptions');
    })
    .then((result) => {
        // console.log(`result: ${JSON.stringify(result, null, 2)}`);
        const list = result.body._embedded["webhook-subscriptions"];
        for (let i = 0; i < list.length; i += 1) {
            console.log(`${list[i].id}: ${list[i].url}`);
        }
    });