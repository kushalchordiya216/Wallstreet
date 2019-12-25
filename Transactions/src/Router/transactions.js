const kafka = require("kafka-node");

require("../../database/connector");
const { Buy, Sell, Transactions } = require("../../database/models");

const client = kafka.KafkaClient();
const producer = kafka.Producer(client);
//TODO: declare consumer as part of the proper consumer group, consuming from proper partition

const fetchBids = () => {
  //after consumer fetches new trade bids, ad them to relevant collections
};

const fetchCancellations = () => {
  // consume from cancelledBids topic and remove bids with relevant ids from collections
};
const processTransactions = () => {
  //check tables to see if there is any new transaction that can be executed
  // if found, add it to transactions collections and remove bids from buy/sell tables
};

const publishTransactions = () => {
  // Publish completed transactions/cancellation object to the relevant queue topic
};

module.exports = {
  fetchBids: fetchBids,
  fetchCancellations: fetchCancellations
};
