const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
})
app.use(express.static(__dirname));
const Database = require('better-sqlite3');
const db = new Database('prices.db')

app.get('/api/coins', (req,res) => {
    const coins = db.prepare(`
        SELECT p.name, p.symbol, p.coin_id, p.price_usd, p.change_24h
        FROM prices p
        JOIN snapshots s ON s.id = snapshot_id
        WHERE s.id = (SELECT MAX(id) FROM snapshots)
    `).all();

    res.json(coins);
})

app.get('/api/history/:coinId', (req, res) => {
    const rows = db.prepare(`
        SELECT s.timestamp, p.price_usd
        FROM prices p
        JOIN snapshots s ON s.id = p.snapshot_id
        WHERE p.coin_id = ?
        ORDER BY s.timestamp ASC
    `).all(req.params.coinId);
    res.json(rows);
})

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
})


