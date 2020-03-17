const kafka = require("kafka-node");

const publish = (topic, msg) => {
  return new Promise((resolve, reject) => {
    const client = new kafka.KafkaClient(`localhost:9092`);
    const producer = new kafka.Producer(client);

    payloads = [
      {
        topic: topic,
        messages: JSON.stringify(msg),
        partition: 0
      }
    ];

    producer.on("ready", function() {
      producer.send(payloads, function(err, data) {
        if (err) {
          console.log(err);
          return reject("Failed Publish");
        } else {
          // console.log(msg);
          return resolve("Publish Success");
        }
      });
    });
  });
};

module.exports = { publish: publish };
