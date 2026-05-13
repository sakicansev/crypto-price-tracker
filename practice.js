const coins =[ 
    { name: "Bitcoin",   symbol: "BTC",  price: 94000 },
    { name: "Ethereum",  symbol: "ETH",  price: 1800 },
    { name: "Solana",    symbol: "SOL",  price: 120 },
    { name: "USDC",      symbol: "USDC", price: 0.99 },
    { name: "Cardano",   symbol: "ADA",  price: 0.27 },
    { name: "Polkadot",  symbol: "DOT",  price: 1.35 },
    { name: "Avalanche", symbol: "AVAX", price: 10.03 },
    { name: "Chainlink", symbol: "LINK", price: 10.50 },
    { name: "Polygon",   symbol: "POL",  price: 0.10 },
    { name: "Algorand",  symbol: "ALGO", price: 0.12 }
];

function printCoin(coin) {
        console.log(coin.name + " (" + coin.symbol +"): $" + coin.price.toFixed(2));
        if (coin.price < 1) {
            console.log("  ⚠ under $1");
        } else if (coin.price > 10000) {
            console.log( "  * major coin");
        } else {
            console.log("  . mid range");
            }
            
        }



for (let i = 0; i < coins.length; i++) {
    printCoin(coins[i])
}