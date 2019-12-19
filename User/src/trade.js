const express = require("express");

const tradeServer = express();
const PORT = process.env.PORT || 3002;

tradeServer.get("/trade", (req, res) => {
  // Basic trading terminal page, allows user to select a company to trade stocks of
});

tradeServer.get("/trade/:company", (req, res) => {
  // trade terminal for a particular company, will fetch and store company financials (current price)
  // ? how/where do i store it
});

tradeServer.post("/trade/:company", (req, res) => {
  // TODO: Allow user to make bids, includes authenticating the bid by checking user financials and existing stock
  // TODO: publish all to kafka stream
  // To know about the different kinds of bids that can be made, see User/database/models.js/bidSchema
});

tradeServer.post("/trade/cancel/", (req, res) => {
  // cancel pending bid
  // the bid id,which is sent in the url params, will be used to find and cancel the bid
  // cancellation will also be published to a queue
});

// TODO: allow users to cancel bids themselves
tradeServer.listen(PORT, () => {
  console.log(`User Account service Running on ${PORT}....`);
});

//TODO: ANNOUNCE TO SERVICE DISCOVERY
