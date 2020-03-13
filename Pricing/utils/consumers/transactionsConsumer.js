const { consumer } = require("../kafka");

let transactions = {};
/**
 * Transaction is object with following keys
 */
consumer.on("message", async function(message) {
  if (message.topic === "Transactions") {
    let transaction = JSON.parse(message.value);
    if (!(transaction.company in transactions)) {
      transaction[company] = {};
    }
    transactions[company].capital += transaction.price * transaction.volume;
    transactions[company].volume += transaction.volume;
  }
});

/**
 * Accumulate all changes that should happen to stock prices due to transactions executed in the last minute
 * accomplished by taking weighted average of all prices at which transactions occur
 *
 *
 * @param {Object} transactions Object with names of companies as keys
 * value of keys is also an object of the format
 * {capital: {Integer}, volume: {Integer}}
 * capital is total amount of capital exchanged on trades of that company
 * volume is total volume of stocks traded for the particular company
 *
 * @return {Object} newRates object which contains newPrices for all companies as key-value pairs
 * Company name is key, newPrice is value
 */
function accumulateTransactions() {
  let newRates = {};
  for (company in transactions) {
    newPrice[company] =
      transactions[company].capital / transactions[company].volume;
  }
  transactions = {};
  return newRates;
}

module.exports = {
  transactions: accumulateTransactions
};
