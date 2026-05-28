


const notifier = require('node-notifier');



const { saveSnapshot } = require('./db');


const fs = require('fs');
    const coins =[ 
    { name: "Bitcoin",   symbol: "BTC",  price: 0, change: 0, id: "bitcoin",},
    { name: "Ethereum",  symbol: "ETH",  price: 0, change: 0, id: "ethereum"},
    { name: "Solana",    symbol: "SOL",  price: 0, change: 0, id: "solana"},
    { name: "USDC",      symbol: "USDC", price: 0, change: 0, id: "usd-coin"},
    { name: "Cardano",   symbol: "ADA",  price: 0, change: 0, id: "cardano"},
    { name: "Polkadot",  symbol: "DOT",  price: 0, change: 0, id: "polkadot"},
    { name: "Avalanche", symbol: "AVAX", price: 0, change: 0, id: "avalanche-2"},
    { name: "Chainlink", symbol: "LINK", price: 0, change: 0, id: "chainlink"},
    { name: "Polygon",   symbol: "POL",  price: 0, change: 0, id: "polygon-ecosystem-token"},
    { name: "Algorand",  symbol: "ALGO", price: 0, change: 0, id: "algorand" }
];

function printCoin(coin) {
    const price = ("$" + coin.price.toFixed(2)).padStart(12);
    const change = (coin.change >= 0 ? "+" : "") + coin.change.toFixed(2) + "%"
    console.log(coin.name.padEnd(14) + (coin.change >= 0 ? "▲" : "▼") + price + "   " + change);
}

async function getLivePrices(){
    try {
        console.log("\n==========================================");
        const now =  new Date();
        console.log("Fetching prices at: " + now.toLocaleDateString() + " " + now.toLocaleTimeString());
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano,polkadot,usd-coin,avalanche-2,chainlink,polygon-ecosystem-token,algorand&vs_currencies=usd&include_24hr_change=true");
        const data = await response.json();
        if (data.status && data.status.error_code === 429) {
            console.log("Rate limited by CoinGecko. Waiting ...");
            return;
        }
    for (let i=0; i < coins.length; i++){
        coins[i].price = data[coins[i].id].usd;
        coins[i].change = data[coins[i].id].usd_24h_change;   
    }
    coins.sort((a,b) => b.price - a.price);
//    coins.sort((a,b) => b.change - a.change);
    displayCoins()
    displaySummary()
    } catch (error) {
        console.error("Something went wrong: ", error.message);
    }
}

function displayCoins() {
    for (let i=0; i < coins.length; i++){
    printCoin(coins[i])
    }
}

function displaySummary() {
    let topGainer = coins[0];
    let topLoser = coins[0];
    let total = coins.reduce((sum, coin) => sum + coin.price, 0);

    for (let i = 1; i < coins.length; i++){
        if (coins[i].change > topGainer.change){
            topGainer = coins[i];
        }
        if (coins[i].change < topLoser.change) {
            topLoser = coins[i];
        }
    }
    console.log("--- SUMMARY ---");
    console.log("Top Gainer: " + topGainer.name + " (" + topGainer.symbol + ") " + (topGainer.change >= 0 ? "+" : "") + topGainer.change.toFixed(2) + "%");
    console.log("Top Loser: " + topLoser.name + " (" + topLoser.symbol + ") " + (topLoser.change >= 0 ? "+" : "") + topLoser.change.toFixed(2) + "%");
    console.log("Total Portfolio Value: $" + total.toFixed(2));
    console.log("--- Data loaded Successfully ---");
    for (let i = 0; i < coins.length; i++) {
        if (Math.abs(coins[i].change) > 3) {
            notifier.notify({
                title: '🚨 Crypto Alert',
                message: coins[i].name + ' moved ' + coins[i].change.toFixed(2) + '% in 24h',
                sound: true
            });
        }
    }
    const snapshot = {
        timestamp: new Date().toISOString(),
        coins: coins
    };
    fs.appendFileSync('prices.json', JSON.stringify(snapshot) + '\n');
    saveSnapshot(coins);
}

getLivePrices();
setInterval(getLivePrices, 30000);
