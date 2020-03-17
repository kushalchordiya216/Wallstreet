const { consumer } = require("../kafka");
const { Buy, Sell } = require("../../database/models");
const { processTransactions } = require("../../src/controller/stocks");

//TODO: create an in-memory cache to keep track of best bids
consumer.on("message", async function(message) {
  if (message.topic === "Bids") {
    // let bid = JSON.parse(message.value);
    // if (bid.action === "Buy") {
    //   let buybid = new Buy(bid);
    //   await buybid.save();
    // } else {
    //   let sellbid = new Sell(bid);
    //   await sellbid.save();
    // }
    // //process transactions
    // processTransactions(bid);
    console.log(JSON.parse(message.value));
  }
});
