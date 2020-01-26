const kafka = require('kafka-node');

const client = new kafka.KafkaClient({ kafkaHost: process.env.kafkabroker1 }); // process.env.kafkabroker1

const client1 =  new kafka.KafkaClient('localhost:2181');

const producer = new kafka.Producer(client1);

const bidConsumer = new kafka.Consumer(client, [
  { topic: "Bid1", partition: 0 }
]);
const cancelConsumer = new kafka.Consumer(client, [
  { topic: "Cancel", partition: 0 }
]);

module.exports = {
  client: client,
  producer: producer,
  bidConsumer: bidConsumer,
  cancelConsumer: cancelConsumer
};
