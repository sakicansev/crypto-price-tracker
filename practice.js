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
        console.log(coin.name + " (" + coin.symbol +"): $" + coin.price.toFixed(2));
        console.log("   24h: " + (coin.change >= 0 ? "+" : "") + coin.change.toFixed(2) + "%");
        if (coin.price < 1) {
            console.log("  ⚠ under $1");
        } else if (coin.price > 10000) {
            console.log( "  * major coin");
        } else {
            console.log("  . mid range");
            }
            
        }

async function getLivePrices(){

    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano,polkadot,usd-coin,avalanche-2,chainlink,polygon-ecosystem-token,algorand&vs_currencies=usd&include_24hr_change=true");
    const data = await response.json();
    for (let i=0; i < coins.length; i++){
        coins[i].price = data[coins[i].id].usd;
        coins[i].change = data[coins[i].id].usd_24h_change;   
    }
    coins.sort((a,b) => b.price - a.price);
//    coins.sort((a,b) => b.change - a.change);
    for (let i=0; i < coins.length; i++){
        printCoin(coins[i])
    }
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

}
getLivePrices();

