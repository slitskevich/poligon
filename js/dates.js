const fns = require('date-fns');

let lastMonth = fns.subMonths(new Date(), 1);
let monthStart = fns.startOfMonth(lastMonth);
let monthEnd = fns.endOfMonth(lastMonth);

var monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format;
var longName = monthName(lastMonth);
console.log(`month name: ${longName}`);

console.log(`last month: ${lastMonth.getMonth()} ${lastMonth.getFullYear()}`);
console.log(`start: ${monthStart.getTime()}`);
console.log(`end: ${monthEnd.getTime()}`);

console.log(`json date: ${(new Date()).toJSON()}`)
