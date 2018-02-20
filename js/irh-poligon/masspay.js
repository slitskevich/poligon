"use strict";

const Promise = require('bluebird');
const https = require('https');
const fs = require('fs');
const url = require('url');
const queryString = require('query-string');

/**
 * @param {Object} options Options for HTTP request.
 * @param {string} body The content to be sent as the body of the HTTP message.
 * @returns {Promise} Wrapping the result of the query upon success and an Error upon failure.
 * @description https://github.com/petkaantonov/bluebird/issues/196
 */
const requestAsync = Promise.method((options, body) => new Promise((resolve, reject) => {
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
    // logger.info(`requestAsync: ${error.message}`);
    reject(error);
  });

  if (typeof body !== 'undefined' && body) {
    request.write(JSON.stringify(body));
  }
  request.end();
}));

const ACK_PARAMETER = 'ACK';
const ID_PARAMETER = 'CORRELATIONID';
const ACK_SUCCESS = 'Success';

const username = 'germany.sandbox_api1.irewardhealth.com';
const pwd = 'KGDWMPRWLX74J79P';
const version = 90;

const parameters = {
  METHOD: 'MassPay',
  USER: username,
  PWD: pwd,
  VERSION: version,
  RECEIVERTYPE: 'EmailAddress',
  CURRENCYCODE: 'EUR', 
  L_EMAIL0: 'info@irewardhealth.com',
  L_AMT0: 0.03,
  L_UNIQUEID0: 'ID-2017-04-04-1'
};
const address = 'https://api.sandbox.paypal.com/nvp?' + queryString.stringify(parameters);

// const address = 'https://api.sandbox.paypal.com/nvp?METHOD=MassPay&USER=info_api1.irewardhealth.com&PWD=EYMY7VGTWHYC45SZ&VERSION=90&RECEIVERTYPE=EmailAddress&CURRENCYCODE=USD&L_EMAIL0=info@irewardhealth.com&L_AMT0=0.02';

const options = url.parse(address);
options.method = 'GET';
options.key = fs.readFileSync('certificates/paypal_cert_de_sandbox.key'),
options.cert = fs.readFileSync('certificates/paypal_cert_de_sandbox.pem')

return requestAsync(options).then((response) => {
  const result = queryString.parse(response.body);
  console.log(JSON.stringify(result, null, 2));
  if (result[ACK_PARAMETER] === ACK_SUCCESS) {
    return Promise.resolve(result[ID_PARAMETER]);
  } else {
    return Promise.reject(result[ACK_PARAMETER]);
  }
}).catch((err) => {
  console.log('error: ', err);
})