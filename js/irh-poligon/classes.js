'use strict';

class Paypal {
  constructor(user) {
		Object.defineProperty(this, 'user', {
      enumerable: true,
      configurable: false,
      writable: true,
      value: user
    });
	}
}

var testClass = Paypal;
var instance = new testClass({name: "slava"});

console.log("instance: ", instance);
