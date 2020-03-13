const kafka = require("kafka-node");
const client = new kafka.KafkaClient(`${process.env.KAFKA_BROKER}`);

// Run the file to create topics on kafka instance, once created, it will run without issues
// only eeds to be created once

var topicsToCreate = [
  {
    topic: "Prices",
    partitions: 1,
    replicationFactor: 1
  },
  {
    topic: "Cancelled",
    partitions: 1,
    replicationFactor: 1
  },
  {
    topic: "Transactions",
    partitions: 1,
    replicationFactor: 1
  },
  {
    topic: "Bids",
    partitions: 1,
    replicationFactor: 1
  }
];

client.createTopics(topicsToCreate, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});

module.exports = {
  client: client
};
