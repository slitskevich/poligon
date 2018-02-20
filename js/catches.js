const Promise = require('bluebird');

class MyError extends Error {
}
MyError.prototype = Object.create(Error.prototype);

const result = Promise.resolve()
    .then(() => {
        const text = "anything";
        // const object = JSON.parse(text);
        return Promise.reject(new MyError());
    })
    .catch(MyError, error => {
        console.log(`my error: ${error}`);
    })
    .catch((error) => {
        console.log(`error: ${error}`);
    })