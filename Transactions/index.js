const { processTransactions } = require("./src/transactions");
const { rollback,processCancellation } = require("./src/rollback");
const { bidConsumer, cancelConsumer } = require("./src/kafka");
const {Buy,Sell,Transactions} = require("./database/models")

//TODO: manage consumer offset
/**
 * after consumer fetches new trade bids, add them to relevant collections
 * @param message message fetched from kakfa should be a string which can be parsed into an obj
 * Object must have following keys :
 *
 * - _id: bid id
 * - user: id of user making the bid
 * - company: company name
 * - action: buy/sell
 * - volume
 * - price
 */
bidConsumer.on("message", async function(message) {
  try {
    const bid_obj = JSON.parse(message.value);
    if (bid_obj.action === "buy") {
      const bid = new Buy(JSON.parse(message.value));
      console.log(bid);
      await bid.save();
    } else if (bid_obj.action === "sell") {
      const bid = new Sell(JSON.parse(message.value));
      await bid.save();
    }
    processTransactions(bid_obj);
  } catch (error) {
    console.log(error);
  }
});

/**
 * after consumer fetches a cancellation request, call processCancellation function
 * @param message message fetched from kafka should be a string which can be parsed into an object
 * Object must have following kys:
 *
 * - action: buy/sell
 * - _id: id of the bid
 */
cancelConsumer.on("message", async function(message) {
  try {
    const cancel_obj = JSON.parse(message.value);
    processCancellation(cancel_obj);
  } catch (error) {
    console.log(error);
  }
});

// call rollback function every 5 min
setInterval(rollback,  3000000); 
