'use strict';

const Promise = require('bluebird');
const fs = require('fs');
Promise.promisifyAll(fs);

const commandLineArgs = require('command-line-args'); 
const optionDefinitions = [
  { name: 'string', alias: 's', type: String, defaultOption: true},
  { name: 'file', alias: 'f', type: String },
  { name: 'region', alias: 'r', type: String, defaultValue: "eu-central-1" },
  { name: 'keyId', alias: 'k', type: String, defaultValue: "alias/irh-financial" },  
  { name: 'output', alias: 'o', type: String }
];
const options = commandLineArgs(optionDefinitions);
process.env.region = options.region;

const cryptoUtilities = require('./cryptoUtilities.js');

function validateOptions(options) {
    if (options.output === undefined) {
        return Promise.reject('output file name must be specified');
    } else if (options.keyId === undefined) {
        return Promise.reject('CMK key id is required');
    } else if (options.region === undefined) {
        return Promise.reject('AWS regions of CMK key is required');
    }
    return Promise.resolve();
}

return validateOptions(options)
    .then(() => {
        if (options.string !== undefined) {
            return Promise.resolve(options.string);
        } else if (options.file !== undefined) {
            return fs.readFileAsync(options.file);
        } else {
            return Promise.reject('string or file to encode is required')
        }
    })
    .then((plaintext) => {
        return cryptoUtilities.encryptWithCMKAsync(plaintext, options.keyId);
    })
    .then((encrypted) => {
        return fs.writeFileAsync(options.output, JSON.stringify(encrypted, null, 2));        
    })
    .catch((error) => {
        console.log('error: ', error);
    });
