var xregexp = require('xregexp');

function isValidExpression(expression, pattern) {
    return xregexp(pattern).test(expression);
}

var error = "Invalid parameter: Token Reason: Endpoint ar:aws:sns:eu-central-1:330661923777:endpoint/APNS/irh-ios-wundt/7b3ca180-e4c6-3d32-82b3-105271f17798 already exists with the same Token, but different attributes.";
var pattern = ".*Endpoin (arn:aws:sns[^ ]+) already exists with the same Token.*";

function existingEndpointARN(errorMessage) {
  var errorPattern = xregexp("Endpoint (ar:aws:sns[^ ]+) already exists with the same Token");
  if (errorPattern.test(errorMessage)) {
    var arnPattern = xregexp("(arn:aws:sns[^ ]+)");
    var arnMatch = arnPattern.exec(errorMessage);
    if (arnMatch != null && arnMatch.length > 0) {
      return arnMatch[0];
    }
  }
  return null;
}

console.log("carmine: '" + existingEndpointARN(error) + "'");
