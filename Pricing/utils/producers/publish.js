const { producer } = require("../kafka");

const publish = (topic, msg) => {
  return new Promise((resolve, reject) => {
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
          console.log(data);
          return resolve("Publish Success");
        }
      });
    });
  });
};

module.exports = { publish: publish };
