const { Buy, Sell, Transactions } = require("../../database/models");
const { publish } = require("../../utils/producers/publish");
const kafka = require("kafka-node");

// TODO: use node cache to fetch bids
/**
 * Finds the best buyBid(highest price) and best Sellbid(lowest price) for a particular company
 * Returns null if buybid or sellbid doesn't exist for given company
 *
 * @param {String} company name of company for whom best bids are to be found
 *
 * @returns {Array} array with best buyBid as first element, best sellbid as second elemenr
 */
const fetchBestBids = async company => {
  var bestSell1 = Sell.find({ company: company })
    .sort({ price: 1 })
    .limit(1);

  var bestBuy1 = Buy.find({ company: company })
    .sort({ price: -1 })
    .limit(1);

  try {
    let sellBids = await bestSell1;
    let buyBids = await bestBuy1;
    let bestBids = [buyBids[0], sellBids[0]];
    return bestBids;
  } catch (error) {
    return [null, null];
  }
};

/**
 * Called eveytime a new bid is fetched
 * check tables to see if there is any new transaction that can be executed
 * if found, execute appropriate transaction
 * @param {Object} bid Object must have following keys :
 *
 * - _id: bid id
 * - user: id of user making the bid
 * - company: company name
 * - action: buy/sell
 * - volume
 * - price:
 * - category: options/futures/stocks
 */
const processTransactions = async bid => {
  let transactionStatus = "full";
  do {
    try {
      let [buy, sell] = fetchBestBids(bid.company);
      if (buy == null || sell == null) {
        // either no sell bids or no buy bids or both, no transactions can be made
        return;
      }
      if (sell.price <= buy.price) {
        transactionStatus = executeTransactions(bestSell, bestBuy);
      } else {
        transactionStatus = "full"; //no sell bid matches any buybid, move on to next transaction
      }
    } catch (error) {
      console.log(
        `Error at Transactions/src/controller/stocks.js\nError while making transaction for stocks of ${bid.company}`
      );
      console.log(`\n${error}`);
      return;
    }
    setTimeout(() => {}, 1000); // 1s delay make sure a single company's bids don't take up the entire event loop
  } while (transactionStatus == "partial"); // incase of partial transactions keep checking again until a bid can't be executed
};

/**
 * function that actually executes the transaction, by checking the listed volume on each
 * @param sell sell object containng id, price, and volume of sell bid
 * @param buy buy object containng id, price, and volume of sell bid
 * @returns status of transaction as either "full" or "partial"
 */
const executeTransactions = async (sell, buy) => {
  try {
    let status = "partial";
    let buyTableUpdate, sellTableUpdate;
    const minVolume = Math.min(sell.volume, buy.volume);
    if (buy.volume === sell.volume) {
      buyTableUpdate = Buy.findByIdAndDelete(buy._id);
      sellTableUpdate = Sell.findByIdAndDelete(sell._id);
      status = "full";
    } else if (buy.volume === minVolume) {
      buyTableUpdate = Buy.findByIdAndDelete(buy._id);
      sellTableUpdate = Sell.findByIdAndUpdate(sell._id, {
        $inc: { volume: -minVolume }
      });
    } else if (sell.volume === minVolume) {
      sellTableUpdate = Sell.findByIdAndDelete(sell._id);
      buyTableUpdate = Buy.findByIdAndUpdate(buy._id, {
        $inc: { volume: -minVolume }
      });
    }
    // TODO: make schema methods on bidSchema for partial updates

    let spread = (buy.price - sell.price) * minVolume;
    let transaction = new Transactions({
      buyer: buy.user._id,
      seller: sell.user._id,
      buybid: buy._id,
      sellbid: sell._id,
      company: buy.company,
      volume: minVolume,
      price: sell.price,
      spread: spread
    });
    await transaction.save();
    await buyTableUpdate;
    await sellTableUpdate;
    publish("Transactions", transaction);
    // send all requests first and wait for them to complete asynchronously
    return status;
  } catch (error) {
    console.log(error);
  }
};

//TODO: Functions to process options and futures calls

module.exports = {
  processTransactions: processTransactions
};
