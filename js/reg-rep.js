const XRegExp = require('xregexp');

const text = 'You have redeemed *%points% points* ... if you had the real app you would have gotten *%amount%*.';
const array = [["%points%", "200"], ["%amount%", '$0.20']];

function replaceEach(text, replacements) {
    let retVal = text;
  
    const escapes = [['$', '$$$$']];
  
    for (let i = 0; i < replacements.length; i += 1) {
      const nextReplacement = replacements[i];
  
      if (nextReplacement.length === 2) {
        nextReplacement[1] = XRegExp.escape(nextReplacement[1]);//XRegExp.replaceEach(nextReplacement[1], escapes);
      }
    }

    return XRegExp.replaceEach(text, replacements);
}
// const escaping = [["$", "$$$$"]];
// for (let i = 0; i < array.length; i += 1) {
//     let replacement = array[i];
//     if (replacement.length == 2) {
//         replacement[1] = XRegExp.replaceEach(replacement[1], escaping)
//     }
// }
// const test = "$0.10";
// const a2 = test.replace(/$/g, '$$');
// console.log(a2);
// const rep = [["$", "$$$$"]];
// const a = XRegExp.replaceEach(test, rep);
// console.log(a);

let testV = '$0.20';
console.log(`escped value: ${XRegExp.replace(testV, '/$', '$$', 'all')}`);

console.log(`result: ${replaceEach(text, array)}`);

