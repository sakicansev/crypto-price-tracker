const coins = ["Bitcoin", "Ethereum", "USDC", "Solana", "Cardano", "Polkadot", "Avalanche", "Chainlink", "Polygon", "Algorand"];
const prices = [94000, 1800, 1.00, 120, 0.50, 7.50, 25, 20, 1.20, 1.80];

function printPrice(coin, price) {
    console.log(coin + ": $" + price.toFixed(2));
}

for (let i = 0; i < coins.length; i++) {
    printPrice(coins[i], prices[i]);
}