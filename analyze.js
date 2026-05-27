const fs = require('fs');
const raw = fs.readFileSync('prices.json', 'utf8');
const lines = raw.trim().split('\n');

console.log("Snapshots: " + lines.length);

const firstSnapshot = JSON.parse(lines[0]);
const coinIds = firstSnapshot.coins.map(coin => coin.id);
const lastSnapshot = JSON.parse(lines[lines.length - 1]);
const durationMs = new Date(lastSnapshot.timestamp) - new Date(firstSnapshot.timestamp);
const durationMins = Math.round(durationMs / 60000);

let topGainer = null;
let topLoser = null;
let mostVolatile = null;

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
    const first = prices[0];
    const last = prices[prices.length - 1];
    const change = ((last - first) / first) * 100;
    console.log(coinName + ": $" + first + " → $" + last + "  " + (change >= 0 ? "+" : "") + change.toFixed(2) + "%");
    console.log(coinName + " Min: $" + Math.min(...prices));
    console.log(coinName + " Max: $" + Math.max(...prices));
    console.log(coinName + " Avg: $" + avg.toFixed(2));
    console.log("---");

    const range = Math.max(...prices) - Math.min(...prices);
        if (topGainer === null || change > topGainer.change) {
            topGainer = { name: coinName, change: change };
        }
        if (topLoser === null || change < topLoser.change) {
            topLoser = { name: coinName, change: change };
        }
        if (mostVolatile === null || range > mostVolatile.range) {
            mostVolatile = { name: coinName, range: range}
        }
}

console.log("--- SESSION SUMMARY ---");
console.log("Top Gainer: " + topGainer.name + " +" + topGainer.change.toFixed(2) + "%");
console.log("Top Loser: " + topLoser.name + " " + topLoser.change.toFixed(2) + "%");
console.log("Most Volatile: " + mostVolatile.name);
console.log("Duration: " + durationMins + " mins, " + lines.length + " snapshots");