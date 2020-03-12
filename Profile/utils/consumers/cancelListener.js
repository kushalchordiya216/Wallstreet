const { consumer } = require("../kafka");
const { Profile, Bid } = require("../../database/models");

let cancelToProfileQuery = cancel => {
  let query = null;
  // add money if bid was buy bid, stocks if it was sell bid
  if (cancel.action === "buy") {
    query = {
      filter: { _id: cancel.buyer },
      update: {
        $inc: {
          cash: cancel.volume * cancel.price
        }
      }
    };
  } else if (cancel.action === "sell") {
    query = {
      updateOne: {
        filter: {
          _id: cancel.user,
          "stocks.company": cancel.company
        },
        update: { $inc: { "stocks.$.volume": cancel.volume } }
      }
    };
  }
  return query;
};

let cancelToBidQuery = cancel => {
  let query = {
    updateOne: {
      filter: { _id: cancel._id },
      update: { status: "cancelled" }
    }
  };
  return query;
};

consumer.on("message", async function(message) {
  if (message.topic === "Cancelled") {
    let cancellations = JSON.parse(message.value);

    let bulkUpdateProfile = cancellations.map(
      cancelToProfileQuery,
      cancellations
    );

    let bulkUpdateBids = cancellations.map(cancelToBidQuery, cancellations);

    let bulk_res_profile = await Profile.bulkWrite(bulkUpdateProfile);
    let bulk_res_bid = await Bid.bulkWrite(bulkUpdateBids);
    console.log(bulk_res_profile.modifiedCount, bulk_res_bid.modifiedCount);
  }
});
