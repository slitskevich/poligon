const Promise = require('bluebird');
const utilities = require('./../../utilities');
var stripe = require("stripe")("sk_test_PnoY9V8ai7zusRCxmkhobxK8");

let inProgress = true;
let startAfter;
const result = utilities.promiseWhile(
  () => inProgress,
  () => stripe.subscriptions.list({
    starting_after: startAfter,
    plan: "irh-initial",
  }).then((result) => {
    if (result.data !== undefined && result.data.length > 0) {
      for (var i = 0; i < result.data.length; i += 1) {
        console.log(`next id: ${result.data[i].id}`);
      }
      console.log('-----');
      startAfter = result.data[result.data.length - 1].id;
    } else {
      inProgress = false;
    }
  }).catch((error) => {
    console.log(`error: ${JSON.stringify(error, null, 2)}`);
    inProgress = false;
  }));

// 1514889642 sub_C3v21oYvh5SR0A
// si_C3v2ArXoMp51yS