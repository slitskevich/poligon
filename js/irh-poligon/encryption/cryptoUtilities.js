'use strict';

const Promise = require('bluebird');
const crypto = require('crypto');
const aws = require('aws-sdk');
const kms = new aws.KMS({'region': process.env.region});
Promise.promisifyAll(kms);

function encrypt(content, key) {
  const cipher = crypto.createCipher('aes-256-ctr', key);
  let crypted = cipher.update(content, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}
exports.encrypt = encrypt;

function decrypt(message, key) {
  const decipher = crypto.createDecipher('aes-256-ctr', key);
  let decrypted = decipher.update(message, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
exports.decrypt = decrypt;

function decryptWithCMKAsync(encryptedData) {
    var params = {
        CiphertextBlob: new Buffer(encryptedData.key)
    };
    return kms.decryptAsync(params).then((data) => {
        const plaintextKey = data.Plaintext.toString('utf-8');
        return decrypt(encryptedData.cipher, plaintextKey);
    });
}
exports.decryptWithCMKAsync = decryptWithCMKAsync;

function encryptWithCMKAsync(content, keyId) {
    const params = {
        KeyId: keyId,
        KeySpec: "AES_256"
    };
    return kms.generateDataKeyAsync(params)
        .then((keyData) => {
            return {
                key: keyData.CiphertextBlob,
                cipher: encrypt(content, keyData.Plaintext.toString('utf-8'))
            };
        });
}
exports.encryptWithCMKAsync = encryptWithCMKAsync;