const kafka = require("kafka-node");
require("../database/connector");
const { Company } = require("../database/models");

const client = kafka.KafkaClient(process.env.kafkabroker2);
const producer = kafka.Producer(client);

/**
 * publish newPrice to the kafka messagebroker
 * @param {Object} newPrices object conaining new prices for each in key-value pairs
 */
function publishPrices(newPrices) {
  const flag = true;
  while (flag) {
    payloads = {
      topic: "Pricing",
      messages: JSON.stringify(newPrices),
      partition: 0
    };
    producer.on("ready", () => {
      producer.send(payloads, function(err, data) {
        if (err) {
          console.error(err);
          flag = true;
          return;
        }
        console.log(data);
        flag = false;
      });
    });
    producer.on("error", err => {
      console.error(err);
      flag = true;
    });
    setTimeout(() => {
      console.log("Attempting publishing again after 1 sec....");
    }, 100);
  }
}

/**
 * Update new prices of each company in compnay collection in database
 * @param {Object} newPrices
 */
async function updatePrices(newPrices) {
  const company = new Company();
  for (company in newPrices) {
    await company.updateOne({ name: company }, { price: newPrices.company });
  }
}

/**
 * publish spread to the kafka messagebroker
 * @param {Object} spread object conaining new prices for each in key-value pairs
 */
function publishSpread(spread) {
  const flag = true;
  while (flag) {
    payloads = {
      topic: "Spread",
      messages: JSON.stringify(spread),
      partition: 0
    };
    producer.on("ready", () => {
      producer.send(payloads, function(err, data) {
        if (err) {
          console.error(err);
          flag = true;
          return;
        } else {
          console.log(data);
          flag = false;
        }
      });
    });
    producer.on("error", err => {
      console.error(err);
      flag = true;
    });
    setTimeout(() => {
      console.log("Attempting publishing again after 1 sec....");
    }, 100);
  }
}

module.exports = {
  publishPrices: publishPrices,
  publishSpread: publishSpread,
  updatePrices: updatePrices
};
