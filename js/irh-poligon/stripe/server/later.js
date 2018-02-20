const later = require('later');
later.date.UTC();

// const schedule = '0 0 25 * ? *';
// const from = 1517443200000;
// // const from = Date.now();
// console.log(`from: ${from}`);
// console.log(`now: ${Date.now()}`);
// const parsed = later.parse.cron(schedule);
// const next = later.schedule(parsed).next(2, from)
// console.log(`parsed: ${JSON.stringify(next, null, 2)}`);
// const first = new Date(next[0]);
// console.log(`first: ${first}`);

const paymenSchedule = '0 0 25 * ? *';
const earliestDate = 1515509400000;
const schedule = later.schedule(later.parse.cron(paymenSchedule))
                          .next(1, earliestDate);

console.log(`schedule: ${schedule}`);

// const firstItem = schedule[0];

// console.log(`firstItem: ${firstItem}`);

const next = (new Date(schedule)).getTime() / 1000;

console.log(`next: ${next}`);
