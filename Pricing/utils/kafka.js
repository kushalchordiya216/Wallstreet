const kafka = require("kafka-node");
const client = new kafka.KafkaClient(`${process.env.KAFKA_BROKER}`);
const producer = new kafka.Producer(client);

const consumer = new kafka.Consumer(
  client,
  [
    { topic: "Transactions", partition: 0, offset: -1 },
    { topic: "Bids", partition: 0, offset: -1 }
  ],
  { autoCommit: true, fromOffset: true }
);

module.exports = {
  client: client,
  consumer: consumer,
  producer: producer
};
