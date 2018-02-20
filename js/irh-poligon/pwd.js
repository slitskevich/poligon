var crypto = require('crypto');
var utf8 = require('utf8');

function sign(content, key) {
	console.time('Time to sign content');
   	var hmac = crypto.createHmac('SHA256', utf8.encode(key));
       console.log("hmac: ", hmac);
   	var utf8Content = utf8.encode(content);
       console.log("utf8Content: ", utf8Content);
   	hmac.update(utf8Content, 'utf8');
       console.log("hmac: ", hmac);
   	var mac = hmac.digest('hex');
       console.log("mac: ", mac);
    console.timeEnd('Time to sign content');
   	return mac;
};

function hashedPassword(password, salt) {
    console.log("hashPassword, password: " + password + ", salt: " + salt);
	return sign(salt, password);
};

var saltAddon = 'Gbo9UuBYjBiGjHkNjDB6vh9EQ8Tu4L';
var salt03 = "d5a863ba2bf7c92369fdd656926fc188";
var bigSalt = salt03 + saltAddon;
var pwd = "1234sS";

var oldSalt = oldUser.password;
var oldPassword = oldUser.salt + V0_3_SALT_APPEND

// console.log("hashed: ", hashedPassword(pwd, salt03));
// console.log("hashed with addon: ", hashedPassword(bigSalt, pwd));
console.log("old: ", hashedPassword(oldPassword, oldSalt));