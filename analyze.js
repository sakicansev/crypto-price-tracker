const fs = require('fs');
const raw = fs.readFileSync('prices.json', 'utf8');
const lines = raw.trim().split('\n');

console.log("Snapshots: " + lines.length);

const firstSnapshot = JSON.parse(lines[0]);
const coinIds = firstSnapshot.coins.map(coin => coin.id);

for (let i = 0; i < coinIds.length; i++) {
    const coinId = coinIds[i];
    
    const prices = [];
    
    for (let j = 0; j < lines.length; j++) {
        const snapshot = JSON.parse(lines[j]);
        const coin = snapshot.coins.find(c => c.id === coinId);
        prices.push(coin.price);
    }
    
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    console.log(coinId + " Min: $" + Math.min(...prices));
    console.log(coinId + " Max: $" + Math.max(...prices));
    console.log(coinId + " Avg: $" + avg.toFixed(2));
    console.log("---");
}