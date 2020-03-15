const { consumer } = require("../kafka");
const { Company } = require("../../database/models");

/**
 * bid is a bid made by users. It is an object with following keys
 *
 * user:  _id of user
 * company: name of company,
 * volume: volume of shares requested,
 * price: price of shares,
 * category: stocks/options/futures,
 * action: buy/sell,
 * status: Pending/partial/complete/cancelled
 */
let buyBids = {};
let sellBids = {};

consumer.on("message", async function(message) {
  if (message.topic === "Bids") {
    let bid = JSON.parse(message.value);
    if (bid.action === "buy") {
      if (!(bid.company in buyBids)) {
        buyBids[company] = 0;
      }
      buyBids[company] += bid.price * bid.volume;
    } else {
      if (!(bid.company in sellBids)) {
        sellBids[company] = 0;
      }
      sellBids[company] += bid.price * bid.volume;
    }
  }
});

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
 * @param {Object} buyarr Object where key is company name, value is total inflow of money
 * @param {Object} sellarr  Object where key is company name, value is total outflow of money
 *
 * @return {Array} Array containing two objects
 * cashflow object which contains calculated cashflow rates, as key value pair (i.e. company:cashflow)
 * currentPrices object, which contains current market price as key value pairs
 */
let accumulateBids = async () => {
  let query = await Company.find({}, "company price");
  let currentPrices = {};
  query.forEach(res => {
    currentPrices[res.name] = res.price;
  });

  let cashflow = {};
  for (company in buyBids) {
    cashflow[company] =
      (buyBids[company] - sellBids[company]) / currentPrices[company];
  }
  buyBids = {};
  sellBids = {};
  return new Array(cashflow, currentPrices);
};
//returns promise

module.exports = {
  bids: accumulateBids
};
