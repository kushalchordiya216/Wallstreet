const kafka = require("kafka-node");
const { client } = require("./producers/initializeKafka");

const consumer = new kafka.Consumer(
  client,
  [
    { topic: "Prices", partition: 0, offset: -1 },
    { topic: "Transactions", partition: 0, offset: -1 },
    { topic: "Cancelled", partition: 0, offset: -1 }
  ],
  {
    autoCommit: true,
    fromOffset: true
  }
);

const producer = new kafka.Producer(client);

module.exports = {
  client: client,
  consumer: consumer,
  producer: producer
};
