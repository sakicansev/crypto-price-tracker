const Database = require('better-sqlite3');
const db = new Database('prices.db');
const snapshots = db.prepare('SELECT * FROM snapshots ORDER BY timestamp ASC') .all();

console.log("Snapshots: " + snapshots.length);

const coinRows = db.prepare('SELECT DISTINCT coin_id, name FROM prices').all();

// to see what it looks like: console.log(coinRows);

const first = db.prepare('SELECT timestamp FROM snapshots ORDER BY timestamp ASC LIMIT 1').get();
const last = db.prepare('SELECT timestamp FROM snapshots ORDER BY timestamp DESC LIMIT 1').get();
const durationMins = Math.round((new Date(last.timestamp) - new Date(first.timestamp))/ 60000);

console.log("Duration: " + durationMins + " mins");

let topGainer = { name: "", change: -Infinity };
let topLoser = { name: "", change: Infinity };
let mostVolatile = { name: "", range: 0 };

for (let i = 0; i < coinRows.length; i++) {
    const coinId = coinRows[i].coin_id;
    const coinName =  coinRows[i].name;

    const rows = db.prepare('SELECT price_usd FROM prices WHERE coin_id = ?').all(coinId);
    const prices = rows.map(row => row.price_usd);

    const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const first = prices[0];
    const last = prices[prices.length - 1];
    const change = ((last - first) / first) * 100;

    const range = Math.max(...prices) - Math.min(...prices);

    if (change > topGainer.change) topGainer = { name: coinName, change: change };
    if (change < topLoser.change) topLoser = { name: coinName, change: change };
    if (range > mostVolatile.range) mostVolatile = { name: coinName, range: range };

    console.log(coinName + ": $" + first + " → $" + last + "  " + (change >= 0 ? "+" : "") + change.toFixed(2) + "%");
    console.log("Min: $" + Math.min(...prices));
    console.log("Max: $" + Math.max(...prices));
    console.log("Avg: $" + avg.toFixed(2));
    console.log("---")
}
console.log("--- SESSION SUMMARY ---");
console.log("Top Gainer: " + topGainer.name + " " + (topGainer.change >= 0 ? "+" : "") + topGainer.change.toFixed(2) + "%");
console.log("Top Loser: " + topLoser.name + " " + topLoser.change.toFixed(2) + "%");
console.log("Most Volatile: " + mostVolatile.name);
console.log("Duration: " + durationMins + " mins, " + snapshots.length + " snapshots");
