process.env.AWSRegion = 'us-east-1';

const LIVE = 'production';
const SNBX = 'sandbox';
const environment = SNBX;

const aws = require('aws-sdk');

const credentials = new aws.SharedIniFileCredentials({ profile: environment });

aws.config.credentials = credentials;

const utilities = require('./../../utilities');
const Promise = require('bluebird');

var fs = require('fs');
Promise.promisifyAll(fs);

const pathLive = './stripe_secrets_live.encrypted';
const pathSnbx = './stripe_secrets_sandbox.encrypted';
const pathEncoded = environment === LIVE ? pathLive : pathSnbx;

let key;
let cipher;
const result = fs.readFileAsync(pathEncoded)
    .then((encoded) => {
        const encryptedData = JSON.parse(encoded);
        console.log(`encrypted data key: ${JSON.stringify(encryptedData.key, null, 2)}`);
        key = new Buffer(encryptedData.key.buf.data);
        cipher = encryptedData.cipher;
        utilities.decryptDataKeyAsync(key);
    })
    .then(dataKey => utilities.decrypt(cipher, dataKey))
    .then((stripeSecretsPlain) => {
        console.log(`decoded: ${stripeSecretsPlain}`);
        const secrets = JSON.parse(stripeSecretsPlain);
        console.log(`secrets: ${JSON.stringify(secrets, null, 2)}`);
    });
