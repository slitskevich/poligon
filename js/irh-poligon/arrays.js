var Items = [ { en: 'Running', activityId: 141 }, { en: 'Aqua Jogging (Deep Water Running)', activityId: 11 } ];
console.log("count: ", Items.length);
for (var activity in Items) {
  console.log("activity: ", Items[activity]);
}
