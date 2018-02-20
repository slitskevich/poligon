'use strict';

const Promise = require('bluebird');
const crypto = require('crypto');
const fs = require('fs');

const KMS_REGION = "eu-central-1";
const CMK_ID = "d04251e4-fed8-45f8-b452-af5a4536b536";

const aws = require('aws-sdk');
const kms = new aws.KMS({'region': 'eu-central-1'});
Promise.promisifyAll(kms);

const password = 'my-secret-password';

function encrypt(content, key) {
  const cipher = crypto.createCipher('aes-256-ctr', key);
  let crypted = cipher.update(content, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(message, key) {
  const decipher = crypto.createDecipher('aes-256-ctr', key);
  let decrypted = decipher.update(message, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

function encryptAsync(plaintext) {
    const params = {
        KeyId: CMK_ID, 
        Plaintext: plaintext
    };
    return kms.encryptAsync(params).then((data) => {
        return data.CiphertextBlob;
    })
}

function generateDataKeyAsync() {
    var params = {
        KeyId: CMK_ID,
        KeySpec: "AES_256"
    };
    return kms.generateDataKeyAsync(params);
}

function decryptAsync(cipher) {
    var params = {
        CiphertextBlob: cipher
    };
    return kms.decryptAsync(params).then((data) => {
        return data.Plaintext.toString('utf-8');
    });
}

const ENCRYPTED_FILE_NAME = 'encrypted_data.json';
return generateDataKeyAsync()
    .then((keyData) => {
        const encryptedData = {
            key: keyData.CiphertextBlob,
            cipher: encrypt(password, keyData.Plaintext.toString('utf-8'))
        }
        fs.writeFileSync(ENCRYPTED_FILE_NAME, JSON.stringify(encryptedData, null, 2));
    })
    .then(() => {
        const encryptedData = JSON.parse(fs.readFileSync(ENCRYPTED_FILE_NAME));
        return decryptAsync(new Buffer(encryptedData.key))
            .then((key) => {
                return decrypt(encryptedData.cipher, key);
            })
    })
    .then((decrypted) => {
        console.log('decrypted: ', decrypted);
    })
    .catch((error) => {
        console.log('error: ', error);
    });

