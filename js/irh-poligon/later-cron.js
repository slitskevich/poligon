const later = require('later');

let NotificationRate = '0,30 * * * ? *';

const notifySchedule = later.parse.cron(NotificationRate);

console.log('notifySchedule: ', notifySchedule);