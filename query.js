const Database = require('better-sqlite3');
const db = new Database('prices.db');

const args = process.argv.slice(2);
const coinId = args[0];

const hoursArg = args.indexOf('--hours');
const hours = hoursArg !== -1 ? parseInt(args[hoursArg + 1]): null;


if(!coinId) {
    console.log("Usage: node query.js <coin-id>");
    console.log("example: node query.js bitcoin");
    process.exit(1);
}

let query = `
    SELECT s.timestamp, p.price_usd
    FROM prices p
    JOIN snapshots s ON s.id = p.snapshot_id
    WHERE p.coin_id = ?
`;
if (hours) {
    query += ` AND s.timestamp >= datetime('now', '-${hours} hours')`;
}

query += ` ORDER BY s.timestamp ASC`;

const rows = db.prepare(query).all(coinId);

if (rows.length === 0) {
    console.log("No data found for: " + coinId);
    process.exit(1);
} 

console.log("Results for: " + coinId);
console.log("Total snapshots: " + rows.length);
console.log("First: " + rows[0].timestamp + "  $" + rows[0].price_usd);
console.log("Last: " + rows[rows.length-1].timestamp + "  $" + rows[rows.length-1].price_usd);