const client = new kafka.KafkaClient({ kafkaHost: process.env.kafkabroker1 });

const producer = new kafka.Producer(client);

const bidConsumer = new kafka.Consumer(client, [
  { topic: "Bid", partition: 0 }
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
