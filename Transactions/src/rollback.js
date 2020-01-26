require("../database/connector");
const { Buy, Sell } = require("../database/models");
const kafka = require('kafka-node');
//const { producer } = require("./kafka");

/**
 * checks buy tables and sell tables for bids that have been inactive for more than 30 minutes
 * removes those entries from the collection and publishes _ids to rollback topic
 */
const processRollback = async () => {
  // FIXME: corner case of a transaction getting executed and rolled back at the same time
  // consider pausing bidConsumer when rollbacks are processed
  try {
    const buyBids = Buy.find(
      {
        updatedAt: { $lt: new Date(Date.now() - 1800000) }
      },
      { _id: 1 }
    );
    const sellBids = Sell.find(
      {
        updatedAt: { $lt: new Date(Date.now() - 1800000) }
      },
      { _id: 1 }
    );

    let buyIds = (await buyBids).map(element => element._id);
    let sellIds = (await sellBids).map(element => element._id);

    await Buy.deleteMany({ _id: { $in: buyIds } });
    await Sell.deleteMany({ _id: { $in: sellIds } });

    publishRollback([...buyIds, ...sellIds]);
  } catch (error) {
    console.log(error);
  }
};

/**
 * called everytime a cancellation bid is made
 * function checks to see if bid being cancelled is in the respective collection,
 * if it is, removes it and publishes it to rollback topic on message queue
 * @param {*} cancel_obj object with the following keys
 *
 * - action: whether bid was buy or sell
 * - _id: _id of the bid
 */
const processCancellation = async cancel_obj => {
  try {
    console.log("Cancelling");
    let model, bid;
    if (cancel_obj.action === "sell") {
      model = Sell;
    } else if (cancel_obj.action === "buy") {
      model = Buy;
    }
    bid = await model.find(cancel_obj._id);
    if (bid) {
      model.findByIdAndDelete(cancel_obj._id);
      publishRollback([cancel_obj._id]);
    } else {
      throw new Error(
        "Bid requesting to be cancelled doesn't exist likely already executed"
      );
    }
  } catch (error) {
    console.log(error);
  }
};

// publish rollbacks to message queue
const publishRollback = arr => {
  try {
    let payloads = [];
    arr.forEach(element => {
      console.log(element);
      payloads.push({ topic: "Rolledback", messages: element });
    });


    const client1 =  new kafka.KafkaClient('localhost:2181');
    const producer = new kafka.Producer(client1);

    producer.on("ready", function() {
      console.log("Sending RolledBack PAyloads")
      producer.send(payloads,function(err,data){
        if(err)
        {
          console.log("NOT rolledBack");
        }
  
        else
        {
          console.log("RolledBack");

        }
      });
    });
    //TODO: handle errors in case message queue is down/unreachable
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  rollback: processRollback,
  processCancellation: processCancellation
};
