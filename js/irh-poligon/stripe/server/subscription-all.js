const Promise = require('bluebird');
const utilities = require('./../../utilities');
var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

function loadAsync(id) {
  return Promise.resolve(`test ${id}`);
  // return stripe.subscriptions.retrieve(id)
  //   .then((result) => {
  //     console.log(`load result: ${result.id}`);
  //   })
  //   .catch((error) => {
  //     console.log(`load error: ${error}`);
  //   })
}

let inProgress = true;
let startAfter;
const tasks = [];
const result = utilities.promiseWhile(
  () => inProgress,
  () => stripe.subscriptions.list({
    starting_after: startAfter,
    plan: "irh-initial",
  }).then((result) => {
    if (result.data !== undefined && result.data.length > 0) {
      for (var i = 0; i < result.data.length; i += 1) {
        tasks.push(loadAsync(result.data[i].id));
      }
      startAfter = result.data[result.data.length - 1].id;
    } else {
      inProgress = false;
    }
  }).catch((error) => {
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
    inProgress = false;
  }))
  .then(() => {
    console.log(`just before "all"`);
    console.log(`tasks: ${JSON.stringify(tasks, null, 2)}`);
  })
  .all(tasks)
  .then((result) => {
    console.log(`full result: ${JSON.stringify(result, null, 2)}`);
  })
  .catch((error) => {
    console.log(`full error: ${error}`);
  });

// 1514889642 sub_C3v21oYvh5SR0A
// si_C3v2ArXoMp51yS