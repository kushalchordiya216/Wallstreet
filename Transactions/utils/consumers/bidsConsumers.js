const { consumer } = require("../kafka");
const { Buy, Sell, Call, Put } = require("../../database/models");

consumer.on("message", async function(message) {
  if (message.topic === "Bids") {
    let bid = JSON.parse(message.value);
    if (bid.action === "Buy") {
      if (bid.category === "Stocks") {
        let buybid = new Buy(buybid);
        await buybid.save();
      } else {
        let call = new Call(bid);
        await call.save();
      }
    } else {
      if (bid.category === "Stocks") {
        let sellbid = new Sell(bid);
        await sellbid.save();
      } else {
        let put = new Put(bid);
        put.save();
      }
    }
  }
});
