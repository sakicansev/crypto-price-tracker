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

coins.sort((a,b) => b.price - a.price);

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
    for (let i=0; i < coins.length; i++){
        printCoin(coins[i])
    }
}
getLivePrices();