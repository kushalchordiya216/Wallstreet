const kafka = require('kafka-node');

const client = new kafka.KafkaClient();

const Producer = kafka.Producer;

const bidProducer = new Producer(client);


module.exports = bidProducer;