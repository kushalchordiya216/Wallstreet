const { consumer } = require("../kafka");
const { Profile } = require("../../database/models");
require("../../database/connector");

consumer.on("message", async function(message) {
  if (message.topic == "Prices") {
    prices = JSON.parse(message.value);
    for (company in prices) {
      await Profile.updateMany(
        { "stocks.company": company },
        { $set: { "stocks.$.price": prices[company] } }
      );
    }
  }
});
