require("../database/connector");
const express = require("express");
const { Buy, Sell } = require("../../database/models");
const { publish } = require("../../utils/producers/publish");

/**
 * array of objects, each object is a cancelled bid, with same attributes as bids
 */
let Cancellations = [];
const rollbackRouter = express.Router();

rollbackRouter.post("/cancel", async (req, res) => {
  let action = req.body.action;
  let targetBid = null;

  if (action === "Buy") {
    targetBid = await Buy.findOne({ user: req.body.user, _id: req._id });
  } else {
    targetBid = await Sell.findOne({ user: req.body.user, _id: req._id });
  }

  try {
    if (targetBid) {
      await targetBid.remove();
      appendCancellation(targetBid);
      res.send("Bid succcesfully cancelled, changes will reflect soon");
    }
  } catch (error) {
    console.log(error);
    res.send(
      "Bid could not be cancelled, may have been processed already, changes will reflect in your profile shortly"
    );
  }
});

/**
 * checks buy tables and sell tables for bids that have been inactive for more than 30 minutes
 * removes those entries from the collection and publishes _ids to rollback topic
 */
const removeInactive = async () => {
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

    appendCancellation([...buyBids, ...sellBids]);
  } catch (error) {
    console.log(error);
  }
};

const appendCancellation = cancellation => {
  if (Array.isArray(cancellation)) {
    Cancellations.push(...cancellation);
  } else {
    Cancellations.push(cancellation);
  }
};

const publishRollback = () => {
  publish(Cancellations);
  Cancellations = [];
};

const rollback = () => {
  setInterval(() => {
    removeInactive();
    publishRollback();
  }, 18000000);
};

module.exports = {
  rollbackRouter: rollbackRouter,
  rollback: rollback
};
