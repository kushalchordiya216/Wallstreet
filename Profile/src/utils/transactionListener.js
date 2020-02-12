const { consumer } = require("./kafka");
const { Profile, Bid } = require("../../database/models");

consumer.on("message", async function(message) {
  // Listen for published transactions and make changes to the bids and profile collections accordingly
  if (message.topic == "Transactions") {
    const transactions = JSON.parse(message.value);
    /**
     * transactions should be an array of objects
     * each object should have the following keys
     * - buyer _id
     * - seller _id
     * - company name
     * - volume of trade
     * - price of transaction
     * - spread if any
     */

    let bulkQueries = [];
    transactions.forEach(transaction => {
      let query1 = {
        updateOne: {
          filter: {
            _id: transaction.buyer,
            "stocks.company": transaction.company
          },
          update: { $inc: { "stocks.$.volume": transaction.volume } }
        }
      };

      let query2 = {
        updateOne: {
          filter: { _id: transaction.buyer },
          update: {
            $inc: {
              lockedCash: -(
                transaction.volume * transaction.price +
                transaction.spread
              )
            }
          }
        }
      };

      let query3 = {
        updateOne: {
          filter: {
            _id: transaction.seller,
            "stocks.company": transaction.company
          },
          update: { $inc: { "stocks.$.volume": -transaction.volume } }
        }
      };

      let query4 = {
        filter: { _id: transaction.buyer },
        update: {
          $inc: {
            availableCash: transaction.volume * transaction.price
          }
        }
      };
      bulkQueries.push(query1, query2, query3, query4);
    });

    bulk_res = await Profile.bulkWrite(bulkQueries);
    console.log(bulk_res.modifiedCount);
    // TODO: write synthetic test for this without kafka consumer, just array object similar to transactions

    // var bulk = Profile.collection.initializeOrderedBulkOp();
    // transactions.forEach(transaction => {
    //   // increase stock volume and decrease cash for buyer
    //   bulk
    //     .find({ _id: transaction.buyer, "stocks.company": transaction.company })
    //     .update({ $inc: { "stocks.$.volume": transaction.volume } });
    //   bulk.find({ _id: transaction.buyer }).update({
    //     $inc: {
    //       lockedCash: -(
    //         transaction.volume * transaction.price +
    //         transaction.spread
    //       )
    //     }
    //   });

    //   // increase available cash and decrease stock volume for seller
    //   bulk
    //     .find({
    //       _id: transaction.seller,
    //       "stocks.company": transaction.company
    //     })
    //     .update({ $inc: { "stocks.$.volume": -transaction.volume } });

    //   bulk.find({ _id: transaction.seller }).update({
    //     $inc: {
    //       availableCash: transaction.volume * transaction.price
    //     }
    //   });
    // });
    // await bulk.execute();
  }
});
