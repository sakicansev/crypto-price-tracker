const fs = require('fs');
const raw = fs.readFileSync('prices.json', 'utf8');
const lines = raw.trim().split('\n');

console.log("Snapshots: " + lines.length);

const firstSnapshot = JSON.parse(lines[0]);
const coinIds = firstSnapshot.coins.map(coin => coin.id);

for (let i = 0; i < coinIds.length; i++) {
    const coinId = coinIds[i];
    
    const prices = [];
    
    let coinName = "";

    for (let j = 0; j < lines.length; j++) {
        const snapshot = JSON.parse(lines[j]);
        const coin = snapshot.coins.find(c => c.id === coinId);
        coinName = coin.name
        prices.push(coin.price);
    }
    
    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    console.log(coinName + " Min: $" + Math.min(...prices));
    console.log(coinName + " Max: $" + Math.max(...prices));
    console.log(coinName + " Avg: $" + avg.toFixed(2));
    console.log("---");
}