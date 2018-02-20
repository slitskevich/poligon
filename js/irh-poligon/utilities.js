/**
 * http://usejsdoc.org/
 * @file Utilities is a set of useful functions.
 * @copyright © 2015 iRewardHealth, Inc. All rights reserved
 * @module utilities
 */

'use strict';

const crypto = require('crypto');
const utf8 = require('utf8');
// const uuidV4 = require('uuid/v4');
const Promise = require('bluebird');
const xregexp = require('xregexp');
const https = require('https');
const aws = require('aws-sdk');
const _ = require('underscore');
const _string = require('underscore.string'); // eslint-disable-line no-underscore-dangle

// const IrhError = require('./IrhError');
// const Status = require('./Status');

const kms = new aws.KMS({ region: process.env.AWSRegion });

Promise.promisifyAll(kms);

/**
 * http://lollyrock.com/articles/nodejs-encryption/
 * @param {string} content The content to be encrypted
 * @param {string} key The key to be used to encrypt the data
 * @returns {string} The encrypted value.
 */
function sign(content, key) {
  const hmac = crypto.createHmac('SHA256', utf8.encode(key));
  const utf8Content = utf8.encode(content);

  hmac.update(utf8Content, 'utf8');
  const mac = hmac.digest('hex');

  return mac;
}
module.exports.sign = sign;

/**
 * http://lollyrock.com/articles/nodejs-encryption/
 * @param {string} content The content to be encrypted
 * @param {string} key The key to be used to encrypt the data
 * @returns {string} The encrypted value.
 */
function encrypt(content, key) {
  const cipher = crypto.createCipher('aes-256-ctr', key);
  let crypted = cipher.update(content, 'utf8', 'hex');

  crypted += cipher.final('hex');

  return crypted;
}
module.exports.encrypt = encrypt;

/**
 * http://lollyrock.com/articles/nodejs-encryption/
 * @param {string} message The message to be decrypted
 * @param {string} key The key to be used to decrypt the message
 * @returns {string} The decrypted content
 */
function decrypt(message, key) {
  const decipher = crypto.createDecipher('aes-256-ctr', key);
  let decrypted = decipher.update(message, 'hex', 'utf8');

  decrypted += decipher.final('utf8');

  return decrypted;
}
module.exports.decrypt = decrypt;

/**
 * Requests KMS data key.
 * @param {string} cmkId Customer Master Key ID.
 * @returns {Array} Array with two item: plain text data key and encrypted data key
 */
function generateDataKeyAsync(cmkId) {
  const params = {
    KeyId: cmkId,
    KeySpec: 'AES_256',
  };

  return kms.generateDataKeyAsync(params)
    .then(keyData => ({
      key: keyData.Plaintext.toString('utf-8'),
      encryptedKey: keyData.CiphertextBlob,
    }));
}
module.exports.generateDataKeyAsync = generateDataKeyAsync;

/**
 * Requests KMS data key and uses it to encrypt the content
 * @param {string} content The content to be encrypted
 * @param {string} keyId Customer Master Key ID.
 * @returns {Array} Array with the encrypted data as a first item and encrypted data key as a second
 */
function encryptWithDataKeyAsync(content, keyId) {
  return generateDataKeyAsync(keyId)
    .then(({ key, encryptedKey }) => ({
      encryptedData: encrypt(content, key),
      encryptedDataKey: encryptedKey,
    }));
}
module.exports.encryptWithDataKeyAsync = encryptWithDataKeyAsync;

/**
 * Decrypts passed data key using KMS
 * @param {string} encryptedDataKey encrypted data key
 * @returns {string} plain text data key
 */
function decryptDataKeyAsync(encryptedDataKey) {
  const params = {
    CiphertextBlob: new Buffer(encryptedDataKey),
  };

  return kms.decryptAsync(params)
    .then(data => data.Plaintext.toString('utf-8'));
}
module.exports.decryptDataKeyAsync = decryptDataKeyAsync;

/**
 * Decrypts passed data key and uses it to decrypt the content
 * @param {string} encryptedData encrypted value
 * @param {string} encryptedDataKey encrypted data key used to encrypt data
 * @returns {string} The decrypted value.
 */
function decryptWithDataKeyAsync(encryptedData, encryptedDataKey) {
  return decryptDataKeyAsync(encryptedDataKey)
    .then(plaintextKey => decrypt(encryptedData, plaintextKey));
}
module.exports.decryptWithDataKeyAsync = decryptWithDataKeyAsync;

/**
 * Produces a salt, currently used for password storage.
 * @returns {string} A 16-byte salt.
 */
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}
module.exports.generateSalt = generateSalt;

/**
 * Produces a hash to store a password and to compare to a stored password.
 * @param {string} password The password to use to calculate the hash.
 * @param {string} salt The content to be hashed by the password.
 * @returns {string} The hashed content.
 */
function hashPassword(password, salt) {
  return sign(salt, password);
}
module.exports.hashPassword = hashPassword;

/**
 * Generates a UUID v4.
 * @returns {string} A 16-byte UUID.
 */
// function generateUUID() {
//   return uuidV4();
// }
// module.exports.generateUUID = generateUUID;

/**
 * @param {string} email The email to be tested.
 * @returns {boolean} Whether it is a valid email address or not.
 */
function isValidEmail(email) {
  // returns true if the email is a valid email address, false otherwise.
  // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
  // Supposedly unicode-ready; I didn't test it.
  const re = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

  return re.test(email);
}
module.exports.isValidEmail = isValidEmail;

const PASSWORD_LENGTH = 6;

/**
 * @param {string} password The password to be tested.
 * @returns {boolean} Whether the password is valid or not.
 */
function isValidPassword(password) {
  // http://stackoverflow.com/questions/14850553/javascript-regex-for-password-containing-at-least-8-characters-1-number-1-uppe
  // http://www.regular-expressions.info/unicode.html
  // Passwords need to be 6 characters long with 1 lowercase, 1 uppercase, and 1 number.
  return ((typeof password === 'string') &&
    xregexp(`^(?=.*\\d)(?=.*\\p{Ll})(?=.*\\p{Lu}).{${PASSWORD_LENGTH},}$`).test(password));
}
module.exports.isValidPassword = isValidPassword;

/**
 * @returns {string} Generated password.
 */
function generatePassword() {
  // Based off of Steve Gibson's PPP:
  // https://www.grc.com/ppp.htm
  // With the character set !#%+23456789:=?@ABCDEFGHJKLMNPRSTUVWXYZabcdefghijkmnopqrstuvwxyz

  const charCodes = new Uint16Array(PASSWORD_LENGTH);
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;

  new Uint16Array(crypto.randomBytes(PASSWORD_LENGTH * 2).buffer).forEach((currentValue, index) => {
    const UPPERCASE = 'ABCDEFGHJKLMNPRSTUVWXYZ';
    const LOWERCASE = 'abcdefghijkmnopqrstuvwxyz';
    const NUMBERS = '23456789';
    const ALL = UPPERCASE + LOWERCASE + NUMBERS;

    if (!hasUpper) {
      hasUpper = true;
      charCodes[index] = UPPERCASE.charCodeAt(currentValue % UPPERCASE.length);
    } else if (!hasLower) {
      hasLower = true;
      charCodes[index] = LOWERCASE.charCodeAt(currentValue % LOWERCASE.length);
    } else if (!hasNumber) {
      hasNumber = true;
      charCodes[index] = NUMBERS.charCodeAt(currentValue % NUMBERS.length);
    } else {
      charCodes[index] = ALL.charCodeAt(currentValue % ALL.length);
    }
  });

  return String.fromCharCode(...charCodes);
}
module.exports.generatePassword = generatePassword;

/**
 * @returns {string} A Sponsorship ID.
 */
function generateSponsorshipId() {
  // Characters are limited to ones that are easy to pick out & reproduce.
  const chars = 'ABCDEFGHJKLMNPQRTUVWXY346789';
  // Note that this approach only works for a serial code length <= 256.
  const rnd = crypto.randomBytes(16);

  // Creating four four-digit stretches, with a '-' in between.
  const result = new Array(4);

  for (let x = 0; x < 4; x += 1) {
    result[x] = new Array(4);
    for (let y = 0; y < 4; y += 1) {
      result[x][y] = chars[rnd[(x * 4) + y] % chars.length];
    }
    result[x] = result[x].join('');
  }

  return result.join('-');
}
module.exports.generateSponsorshipId = generateSponsorshipId;


/**
 * promiseWhile is a while loop for promise-returning functions.
 * Instead of adding a bunch of bind calls and a passed thisArg, make sure to use arrow notation for
 * the passed functions to preserve this value.
 * @param {function} condition If false, loop has ended.
 * @param {function} action Executed for each iteration.
 * @param {function} result The result of the last promise.
 * @returns {undefined}
 */
module.exports.promiseWhile = Promise.method((condition, action, result) => {
  if (!condition()) return undefined;

  return Promise.method(action)(result).then(exports.promiseWhile.bind(null, condition, action));
});

/**
 * promiseFor is a for loop for promise-returning functions.
 * Instead of adding a bunch of bind calls and a passed thisArg, make sure to use arrow notation for
 * the passed functions to preserve this value.
 * @param {function} condition If false, loop has ended.
 * @param {function} action Executed for each iteration.
 * @param {*} value The initial value of the loop.
 * @returns {*} The final value.
 */
module.exports.promiseFor = Promise.method((condition, action, value) => {
  if (!condition(value)) return value;

  return Promise.method(action)(value).then(exports.promiseFor.bind(null, condition, action));
});

/**
 * promiseIter is a loop that utilizes Generator Iterator functions.
 * Instead of adding a bunch of bind calls and a passed thisArg, make sure to use arrow notation for
 * the passed functions to preserve this value.
 * @param {iterator} iterator of the data.
 * @param {function} action Executed for each iteration.
 * @returns {undefined}
 */
module.exports.promiseIter = Promise.method((iterator, action) => {
  const next = iterator.next();

  if (next.done) return undefined;

  return Promise.method(action)(next.value).then(exports.promiseIter.bind(null, iterator, action));
});

/**
 * @param {Object} obj The object to be tested for emptiness.
 * @returns {boolean} True if empty, false if not.
 */
function isEmpty(obj) {
  // http://stackoverflow.com/questions/4994201/is-object-empty
  // Speed up calls to hasOwnProperty
  const hasOwnProperty = Object.prototype.hasOwnProperty;

  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0) return false;
  if (obj.length === 0) return true;

  // Otherwise, does it have any properties of its own?
  if (Object.getOwnPropertyNames(obj).length > 0) return false;
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (const key in obj) { // eslint-disable-line no-restricted-syntax
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}
module.exports.isEmpty = isEmpty;

/**
 * @returns {string} Session key.
 */
function generateSessionKey() {
  return crypto.randomBytes(16).toString('hex');
}
module.exports.generateSessionKey = generateSessionKey;

/**
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
 * @param {string} str The string to be encoded for URI use.
 * @returns {string} The URI encoded string.
 */
function fixedEncodeURIComponent(str = '') {
  return encodeURIComponent(str).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16)}`);
}
module.exports.fixedEncodeURIComponent = fixedEncodeURIComponent;

// Returns a random integer between min (included) and max (excluded)
/**
 * @param {number} min The minimum value for the random integer, rounded up if not a whole number.
 * @param {number} max The maximum value for the random integer, rounded down if not a while number.
 * @returns {number} A random integer between min & max.
 */
function getRandomInt(min, max) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  // Using Math.round() will give you a non-uniform distribution!
  const intMin = Math.ceil(min);
  const intMax = Math.floor(max);

  return Math.floor(Math.random() * (intMax - intMin)) + intMin;
}
module.exports.getRandomInt = getRandomInt;

/**
 * Returns a random integer between min (included) and max (excluded)
 * @param {number} length The length of the string to be returned.
 * @param {String} characters The characters to use for the generation.
 * @returns {number} A random integer between min & max.
 */
// function getRandomString(length, characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
//   if (!_.isString(characters) || characters.length < 1) {
//     throw new IrhError(new Status(Status.INTERNAL_SERVER_ERROR, `utilities.getRandomString(): characters set to ${JSON.stringify(characters, null, 2)}`));
//   }
//   if (!Number.isInteger(length) || length < 1) {
//     throw new IrhError(new Status(Status.INTERNAL_SERVER_ERROR, `utilities.getRandomString(): characters set to ${JSON.stringify(characters, null, 2)}`));
//   }

//   return _.sample(characters, Math.round(length)).join('');
// }
// module.exports.getRandomString = getRandomString;

/**
 * @param {Object} obj The object to be iterated.
 * @returns {Iterator} An Iterator object for the Object.
 */
function* entries(obj) {
  // https://esdiscuss.org/topic/es6-iteration-over-object-values
  // We are disabling airbnb's suggestion below - we currently use this for PromiseIter. We need to
  // enforce data immutability actively on our Promise*() loops.
  for (const key of Object.keys(obj)) { // eslint-disable-line no-restricted-syntax
    yield [key, obj[key]];
  }
}
module.exports.entries = entries;

// const regions = process.env.Regions.split(' ');

/**
 * @param {string} region The region to be verified.
 * @returns {Boolean} true if a valid region, false otherwise.
 */
function isValidRegion(region) {
  return (typeof region === 'string' && regions.indexOf(region) !== -1);
}
module.exports.isValidRegion = isValidRegion;

// const languages = process.env.Languages.split(' ');

/**
 * @param {string} language The language to be verified.
 * @returns {Boolean} true if a valid language, false otherwise.
 */
function isValidLanguage(language) {
  return (typeof language === 'string' && languages.indexOf(language) !== -1);
}
module.exports.isValidLanguage = isValidLanguage;

/**
 * @param {string} language The primary language.
 * @param {string} languageFallback The fallback language.
 * @returns {string} A resolved language.
 */
function getLanguage(language, languageFallback) {
  return isValidLanguage(language) ? language : languageFallback || process.env.DefaultLanguage;
}
module.exports.getLanguage = getLanguage;

/**
 * @param {string} region The primary region.
 * @param {string} regionFallback The fallback region.
 * @returns {string} A resolved region.
 */
function getRegion(region, regionFallback) {
  return isValidRegion(region) ? region : regionFallback || process.env.DefaultRegion;
}
module.exports.getRegion = getRegion;

/**
 * @param {Object} options Options for HTTP request.
 * @param {string} body The content to be sent as the body of the HTTP message.
 * @returns {Promise} Wrapping the result of the query upon success and an Error upon failure.
 * @description https://github.com/petkaantonov/bluebird/issues/196
 */
const httpsRequestAsync = Promise.method((options, body) => new Promise((resolve, reject) => {
  const request = https.request(options, (response) => {
    // Bundle the result
    const result = {
      httpVersion: response.httpVersion,
      httpStatusCode: response.statusCode,
      headers: response.headers,
      body: '',
      trailers: response.trailers,
    };

    // Build the body
    response.on('data', (chunk) => {
      result.body += chunk;
    });

    // Resolve the promise when the response ends
    response.on('end', () => {
      resolve(result);
    });
  });

  // Handle errors
  request.on('error', (error) => {
    reject(error);
  });

  if (typeof body !== 'undefined' && body) {
    request.write(JSON.stringify(body));
  }
  request.end();
}));

module.exports.httpsRequestAsync = httpsRequestAsync;

/**
 * @param {Array} master The list to which to add the new entries.
 * @param {Array} additions The new additions to the master list.
 * @param {function} comparison A function that takes (oldEntry, newEntry) and returns a boolean
 * value, true if they match, false if not.
 * @returns {Array} The resultant array.
 */
function concatUnique(master, additions, comparison) {
  return master.concat(additions.filter(newEntry =>
    (!master.some(oldEntry => comparison(oldEntry, newEntry)))));
}
module.exports.concatUnique = concatUnique;

/**
 * Creates an unsubscription link.
 * @param {String} email The email address of the user.
 * @param {String} unsubscribeId The verification ID.
 * @returns {String} a link with which the user can unsubscribe.
 */
function createUnsubscribeLink(email, unsubscribeId) {
  return `https://${process.env.WebClientDomain}/unsubscribe?email=${fixedEncodeURIComponent(email)}&key=${unsubscribeId}`;
}
module.exports.createUnsubscribeLink = createUnsubscribeLink;

/**
 * Creates an activation link.
 * @param {String} activationId The activation ID.
 * @param {String} sponsorId The Sponsor ID.
 * @param {String} sponseeId The Sponsee ID.
 * @param {String} firstName The Sponsee's first name.
 * @param {String} lastName The Sponsee's last name.
 * @returns {String} a link with which the user can activate.
 */
function createActivationLink(activationId, sponsorId, sponseeId, firstName, lastName) {
  return `https://${process.env.WebClientDomain}/register?sponsorId=${fixedEncodeURIComponent(sponsorId)
    }&sponseeId=${fixedEncodeURIComponent(sponseeId)
    }&firstName=${fixedEncodeURIComponent(firstName)
    }&lastName=${fixedEncodeURIComponent(lastName)
    }&key=${activationId}`;
}
module.exports.createActivationLink = createActivationLink;

/**
 * Adds \ escapes to the provided characters. Repeats tolerated. Can be run repeatedly without
 * damage.
 * @param {String} text The text string within which to escape.
 * @param {Sring} characters The characters for which to add \ escapes.
 * @returns {String} The text witth \ added before each identified character.
 * Javascript doesn't have negative lookbehind, but does have negative lookahead.
 * https://stackoverflow.com/questions/641407/javascript-negative-lookbehind-equivalent
 */
function escapeCharacters(text, characters) {
  if (typeof text !== 'string' || text.length === 0) {
    return '';
  }
  if (typeof characters !== 'string' || characters.length === 0) {
    return text;
  }

  // Make sure the list of characters are unique.
  const uniqueChars = _.uniq(characters.split('')).join('');
  const reversed = _string.reverse(text);
  const regexp = xregexp(`(?<char>[${uniqueChars}])(?!([\\\\]))`, 'g');
  const reversedResult = xregexp.replace(reversed, regexp, '${char}\\'); // eslint-disable-line no-template-curly-in-string

  return _string.reverse(reversedResult);
}
module.exports.escapeCharacters = escapeCharacters;
