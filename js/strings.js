var str = '';
str += '1st\n';
str += '2nd';
console.log(str);

const guid = "https://www.domradio.de/node/271579";
const result = guid.split("/");
// console.log(`result: ${JSON.stringify(result, null, 2)}`);
console.log(`id: ${result[result.length - 1]}`);