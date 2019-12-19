const express = require("express");

const transactionServer = express();
const PORT = process.env.PORT || 3005;

const fetchBids = () => {
  // TODO: Pull incoming bids and place into db
};

const processBids = () => {
  // TODO: Execute logic for different category of bids
  // includes
  // - market price bids
  // - limits/stop loss
  // - futures/shorts/options
  // successfull bids go into completed transactions collection
};

const publishBids = () => {
  // publish successful transactions to the relevatn queue for analytics and portfolio to consume
};

transactionServer.listen(PORT, () => {
  console.log(`Transactions service running at ${PORT} ....`);
});

//TODO: Announce yourself to service discovery

// TODO: Publish all completed transactions to message queue and to transaction history db
