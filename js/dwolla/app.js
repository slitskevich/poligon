const dwolla = require('dwolla-v2');

const appKey = 'PepwaCeSQtVlkrfww9tonKrReniBHczqOykbQg7458hJ0fLloM';
const appSecret = 'LqLhihAmuoQk21SxlISeJMYbuPiUyWFZh2LZiUqJsOvhbuSC8I';
const client = new dwolla.Client({
  key: appKey,
  secret: appSecret,
  environment: 'sandbox'
});

module.exports.token = client.auth.client();