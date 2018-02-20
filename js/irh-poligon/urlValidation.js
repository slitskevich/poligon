function isValidDestinationUrl(url) {
  const mailFormat = /^(mailto?:([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
  const accountFormat = /^(https:\/\/(api|api-uat).dwolla.com\/accounts\/(\S)+)/i;
  const customerFormat = /^(https:\/\/(api|api-uat).dwolla.com\/customers\/(\S)+)/i;
  const fundingSourcesFormat = /^(https:\/\/(api|api-uat).dwolla.com\/funding-sources\/(\S)+)/i;
  return mailFormat.test(url) || accountFormat.test(url) || customerFormat.test(url) || fundingSourcesFormat.test(url);

  
}

var url = 'mailto:johndoe@email.com';
console.log(url + ': ' + isValidDestinationUrl(url));

// url = ':johndoe@email.com';
// console.log(url + ': ' + isValidDestinationUrl(url));
// url = 'johndoe@email.com';
// console.log(url + ': ' + isValidDestinationUrl(url));
// url = 'mailto:johndoe@';
// console.log(url + ': ' + isValidDestinationUrl(url));
// url = 'mailto:johndoe@gmail';
// console.log(url + ': ' + isValidDestinationUrl(url));
// url = 'mailto:johndoe@gmail.';
// console.log(url + ': ' + isValidDestinationUrl(url));
// url = 'mailto:johndoe@gmail.co';
// console.log(url + ': ' + isValidDestinationUrl(url));

url = 'https://api.dwolla.com/accounts/0cc327c9-18e4-4507-aae1-841b2c7329c9';
console.log(url + ': ' + isValidDestinationUrl(url));
url = 'https://api.dwolla.com/account/0cc327c9-18e4-4507-aae1-841b2c7329c9';
console.log(url + ': ' + isValidDestinationUrl(url));
url = 'https://api.dwolla.com/account/';
console.log(url + ': ' + isValidDestinationUrl(url));
url = 'https://api.dwolla.com/accounts/0cc327c9-18e4-4507-aae1-841b2c7329c9';
console.log(url + ': ' + isValidDestinationUrl(url));