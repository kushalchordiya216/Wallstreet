/**
 * Accumulate all changes that should happen to stock prices due to transactions executed in the last minute
 * accomplished by taking weighted average of all prices at which transactions occur
 *
 *
 * @param {Array} arr Array of objects, each object represents a transactions, having following fields
 *  - company: Name of the company
 *  - price: price at which transaction was executed
 *  - volume: amount of shares exchanged
 *  - spread: spread, if any due to unequal bid and ask price
 *
 * @return {Object} newPrices object which contains newPrices for all companies as key-value pairs
 * Company name is key, newPrice is value
 */
function accumulateTransactions(arr) {
  let trades = {};
  let newPrices = {};
  console.log("Accumulate transactions");
  arr.forEach(transaction => {
    if (!(transaction.company in trades)) {
      trades[transaction.company] = {};
      trades[transaction.company].totalCapital = 0;
      trades[transaction.company].totalVolume = 0;
      trades[transaction.company].name = transaction.company;
    }
    trades[transaction.company].totalCapital +=
      transaction.price * transaction.volume;
    trades[transaction.company].totalVolume += transaction.volume;
    console.log(trades);
  });

  for (const company in trades) {
  
    newPrices[company] =
      trades[company].totalCapital / trades[company].totalVolume;
  }

  console.log(newPrices);

  return newPrices;
}

/**
 * Takes into account supply and demand as factor for deciding price
 * Calculates total amount of cash inflow (buy bids) and substracts total cash outflow (sell bids)
 * for each company
 *
 * Note that it calculates demand and supply relative to current market price.
 * This means that demand and supply is proportional to the ratio of bid/ask price with current market price
 *
 * buybid/CMP ratio high => more demand => higher rise in price
 * CMP/sellbid ratio high => more supply => larger drop in price
 *
 * @param {Array} buyarr array of objects, each object is a buy bid, containing name, price and volume
 * @param {Array} sellarr array of objects, each object is a sell bid, containing name, price and volume
 * @param {Object} currentPrices ab object containing current market price as key-value pairs. key is company name, value is price
 *
 * @return {Object} bidRates, object which contains calculated bidRates for each company as key-value pairs
 */
function accumulateBids(buyarr, sellarr, currentPrices) {
  let bidRates = {};
  buyarr.forEach(buyBid => {
    const company = buyBid.company;
    if (!(buyBid.company in bidRates)) {
      
      console.log(buyBid.company);
      console.log("current");
      console.log(currentPrices[company]);
      bidRates[buyBid.company] = 0;
    }
    bidRates[buyBid.company] += (buyBid.price / currentPrices[company]) * buyBid.volume;
    console.log("In buyArr");
    
    console.log(bidRates[company]);
  });

  sellarr.forEach(sellBid => {
    const company = sellBid.company;
    if (!(sellBid.company in bidRates)) {
      bidRates[company] = 0;
    }
    bidRates[company] -=
      (currentPrices[company] / sellBid.price) * sellBid.volume;
  });
  buyarr = [];
  sellarr = [];
  console.log(bidRates);
  // reset arrays to avoid double counting
  return bidRates;
}

module.exports = {
  accumulateTransactions: accumulateTransactions,
  accumulateBids: accumulateBids
};
