const now = Date.now();

console.log(`now: ${now}`);

const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

console.log(`week ago: ${weekAgo}`);

console.log(`string: ${weekAgo.toJSON()}`);
