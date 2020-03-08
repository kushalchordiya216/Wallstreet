const kafka = require("kafka-node");
const client = new kafka.KafkaClient({ kafkaHost: process.env.kafkabroker1 }); // process.env.kafkabroker1
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
