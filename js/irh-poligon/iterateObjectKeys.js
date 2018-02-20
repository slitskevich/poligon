const rewards = {
    "b4ffbd35-e5c5-4c46-8f40-9fc117500df8": {
        "USD": 0.01
    },
    "68d73acb-3bc9-41a8-b354-ae4ff4a35096": {
        "USD": 0.02
    }
}

const percentage = 0.5
const donations = {};
Object.keys(rewards).forEach((key) => {
    console.log('key: ', key);
    const value = rewards[key];
    console.log('value: ', JSON.stringify(value, null, 2));
    donations[key] = {};
    Object.keys(value).forEach((currency) => {
        const amount = value[currency];
        value[currency] = Math.round(amount * (1 - percentage) * 100) / 100;
        donations[key][currency] = amount - value[currency];
    })
});
console.log('rewards: ', JSON.stringify(rewards, null, 2));
console.log('donations: ', JSON.stringify(donations, null, 2));