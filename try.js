const coins = [
    {name:"Bitcoin", symbol:"BTC", price: 80000},
    {name:"Ethereum", symbol:"ETH", price: 3000},
    {name:"Solona", symbol:"SOL", price: 0.5},
];

function printCoin(coin){
    console.log(coin.name + "(" + coin.symbol + "): $" + coin.price.toFixed(2));
    if (coin.price < 1) {
        console.log("  ∆  under $1")
    } else if (coin.price > 10000) {
        console.log("  √ major coin")
    } else{
        console.log("  ≈ mid range")
    } 
}

for (let i=0; i< coins.length; i++) {
    printCoin(coins[i])
}