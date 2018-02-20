const Promise = require('bluebird');
const utilities = require('./../../utilities');
var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

function task(id) {
    return stripe.subscriptions.retrieve(id);
}

let inProgress = true;
let startAfter;

const idList = [];
const result = utilities.promiseWhile(
    () => inProgress,
    () => stripe.subscriptions.list({
        starting_after: startAfter,
        plan: "irh-initial",
      }).then((result) => {
        if (result.data !== undefined && result.data.length > 0) {
          for (var i = 0; i < result.data.length; i += 1) {
            idList.push(result.data[i].id);
          }
          startAfter = result.data[result.data.length - 1].id;
        } else {
          inProgress = false;
        }
      }))
    .then(() => {
        const tasks = idList.map(id => task(id));
        return Promise.all(tasks);
    })
    .then((result) => {
        console.log(`result: ${result}`);
    })
    .catch((error) => {
        console.log(`error: ${error}`);
    })