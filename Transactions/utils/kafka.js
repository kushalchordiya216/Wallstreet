const kafka = require("kafka-node");
const client = new kafka.KafkaClient("localhost:2181");
const producer = new kafka.Producer(client);

const consumer = new kafka.Consumer(
  client,
  [{ topic: "Bids", partition: 0, offset: -1 }],
  { autoCommit: true, fromOffset: true }
);

module.exports = {
  client: client,
  producer: producer,
  consumer: consumer
};