const express = require("express");

const pricingServer = express();
const PORT = process.env.PORT || 3004;

const updatePrice = () => {
  setInterval(() => {
    //TODO: run periodically, every one minute and analyze all required factors to determine change in stock price
    //TODO: publish new prices to message queue
    /**
     * Currently, the algortihm uses volume of trade and demand/supply as the major facotr for analyzing price
     * a record of all bids is maintained in the transactions message queue topic,
     * numbers of buy and sell bids indicate demand and supply
     * bids with more volume carry more weight
     */
    // Note: only executed transactions are considered for calculating price
    // however all bids made will be considered for analytics, regardless of whether or not it gets executed
  }, 60000);
};

const fetchTransactions = () => {
  setInterval(() => {
    //TODO: run periodically fetch all transactions that have happened since last fetch
    //TODO: Figure out how to fetch only specific transactions from kafka,
    //TODO: and how to ignore transactions that have already been seen
  }, 60000);
};

pricingServer.listen(PORT, () => {
  console.log(`Pricing service running at ${PORT} ....`);
  updatePrice();
  fetchTransactions();
});

//TODO: Announce yourself to service discovery
