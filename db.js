const Database = require('better-sqlite3');
const db = new Database('prices.db');

db.exec(`
    CREATE TABLE IF NOT EXISTS snapshots (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp   TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS prices (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        snapshot_id INTEGER NOT NULL,
        coin_id     TEXT NOT NULL,
        symbol      TEXT NOT NULL,
        name        TEXT NOT NULL,
        price_usd   REAL NOT NULL,
        change_24h  REAL
    );
`);

function saveSnapshot(coins) {
    const timestamp = new Date().toISOString();
// prepare means: get this query but don't run it yet
    const insertSnapshot = db.prepare('INSERT INTO snapshots (timestamp) VALUES (?)');
   
// .run() actually executes it. ? gets replaced with timestamp
// lastInsertRowid is the id of the snapshot row just created   
    const { lastInsertRowid } = insertSnapshot.run(timestamp);

// prepare the price insert query once, run it 10 times (once per coin)
    const insertPrice = db.prepare(`
        INSERT INTO prices (snapshot_id, coin_id, symbol, name, price_usd, change_24h)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    // loop through all coins and save each one
    // snapshot_id links every price row baack to its snapshot
    for (let i = 0; i < coins.length; i++) {
        insertPrice.run(
            lastInsertRowid,    // which snapshot this price belongs to
            coins[i].id,        // "bitcoin" 
            coins[i].symbol,    // "BTX"
            coins[i].name,      // "Bitcoin"
            coins[i].price,     // 76667
            coins[i].change     // -0.69
        )
    }
}
// this makes saveSnapshot available when other files do require('./db')
module.exports = { saveSnapshot };