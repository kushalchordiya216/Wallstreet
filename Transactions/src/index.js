// imports
const express = require("express");
const { Buy, Sell, Put, Call } = require("../database/models");

// background processes and connections
require("../../database/connector");

const server = express();

server.post("/cancel", async (req, res) => {
  let action = req.body.action;
  let category = req.body.category;
  let bid = null;

  if (action === "Buy") {
    if (category === "Stocks") {
      bid = await Buy.findOne({ user: req.body.user, _id: req._id });
    } else if (category === "Options") {
      bid = await Call.findOne({ user: req.body.user, _id: req._id });
    }
  } else {
    if (category === "Stocks") {
      bid = await Sell.findOne({ user: req.body.user, _id: req._id });
    } else if (category === "Options") {
      bid = await Put.findOne({ user: req.body.user, _id: req._id });
    }
  }

  try {
    if (bid) {
      await bid.remove();
      res.send("Bid succcesfully cancelled, changes will reflect soon");
    }
  } catch (error) {
    console.log(error);
    res.send(
      "Bid could not be cancelled, may have been processed already, changes will reflect in your profile shortly"
    );
  }
});

server.listen(3006, () => {
  console.log(`Transactions service listening at ${PORT}`);
});
