const Promise = require('bluebird');

function task() {
    return Promise.resolve().delay(1000);
}

console.log(`start: ${(new Date()).getTime()}`);
return task().timeout(2000).then(() => {
        console.log(`finish: ${(new Date()).getTime()}`);
    }).catch(Promise.TimeoutError, function(e) {
        console.log(`timeout: ${(new Date()).getTime()}`);
    });
