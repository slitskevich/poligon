// import { setInterval } from 'timers';

const Promise = require('bluebird');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const xmlParser = new xml2js.Parser({ explicitArray: false });
const http = require('http');
const url = require('url');

// Promise.promisifyAll(http);

xmlParser.parseStringAsync = Promise.promisify(xmlParser.parseString, { context: xmlParser });

const CONSUMER_KEY = '5ZEK0HRTLEEL2OBTPJSKU4EW';
const DURATION_THRESHOLD = 5000;
const SLEEP_INTERVAL = 10000;

const searchUrl = `http://fddb.info/api/v17/search/item.xml?lang=de&apikey=${CONSUMER_KEY}&q=vitalis`;

function fetchAsync() {    
    return Promise.resolve()
      .then(() => fetch(searchUrl));
}

function httpAsync() {
    const options = url.parse(searchUrl);
    options.method = 'GET';

    return httpRequestAsync(options);
}

const httpRequestAsync = Promise.method((options, body) => new Promise((resolve, reject) => {
    const request = http.request(options, (response) => {
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
  
let fetchStatistic = {
    type: 'fetch',
    totalCount: 0,
    timeoutCount: 0,
    maxDuration: 0,
    periodMaxDuration: 0,
}

let httpStatistic = {
    type: 'http',
    totalCount: 0,
    timeoutCount: 0,
    maxDuration: 0,
    periodMaxDuration: 0,
}

function execute(requestPromise, statistic) {
  const start = Date.now();
  return requestPromise
    .then(() => {
        const duration = Date.now() - start;
        if (duration > statistic.maxDuration) {
            statistic.maxDuration = duration;
        }
        if (duration > statistic.periodMaxDuration) {
            statistic.periodMaxDuration = duration;
        }
    })
    .timeout(DURATION_THRESHOLD)
    .catch(Promise.TimeoutError, (timeoutError) => {
        statistic.timeoutCount += 1;
        console.log(`${Date()}: ${statistic.type} - timed out`);
    })
    .catch((error) => {
        console.log(`${Date()}: ${statistic.type} - error: ${error}`);
    })
    .then(() => {
      statistic.totalCount += 1;
      if (statistic.totalCount % 100 === 0) {
          console.log(`${Date()}. ${statistic.type}: ${statistic.timeoutCount} timeouts / ${statistic.totalCount} total; max duration: ${statistic.periodMaxDuration}ms / overall: ${statistic.maxDuration}ms`);
          statistic.periodMaxDuration = 0;
      }
    });
}

function doFetch() {
    return execute(fetchAsync(), fetchStatistic)
        .then(() => {
            // console.log(`${Date()}. statistic: ${JSON.stringify(fetchStatistic, null, 2)}`);
        });
}

function dohttp() {
    return execute(httpAsync(), httpStatistic)
        .then(() => {
            // console.log(`${Date()}. statistic: ${JSON.stringify(httpStatistic, null, 2)}`);
        });
}

// const result = doFetch()
//     .then(() => {
//         console.log(`${Date()}. statistic: ${JSON.stringify(fetchStatistic, null, 2)}`);
//     });
// const result = dohttp()
//     .then(() => {
//         console.log(`${Date()}. statistic: ${JSON.stringify(httpStatistic, null, 2)}`);
//     });

function configureHttp() {
    setInterval(dohttp, SLEEP_INTERVAL)
}

setInterval(doFetch, SLEEP_INTERVAL);
setTimeout(configureHttp, SLEEP_INTERVAL / 2);
