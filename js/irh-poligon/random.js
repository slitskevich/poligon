var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
var chars = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz", "0123456789"];

var text = "";
var length = 6;
for (var i = 0; i < length; i++) {
  var domainIndex = Math.floor(Math.random() * chars.length);
  var domain = chars[domainIndex];
  var charIndex = Math.floor(Math.random() * domain.length);
  text += domain.charAt(charIndex);
}

console.log(text);
