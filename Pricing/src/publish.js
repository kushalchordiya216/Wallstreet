const kafka = require("kafka-node");
require("../database/connector");
const { Company } = require("../database/models");

const client = new kafka.KafkaClient('localhost:2181');
const producer = new kafka.Producer(client);

/**
 * publish newPrice to the kafka messagebroker
 * @param {Object} newPrices object conaining new prices for each in key-value pairs
 */
function publishPrices(newPrices) {
  
    payloads = {
      topic: "Pricing",
      messages: JSON.stringify(newPrices),
      partition: 0
    };
    console.log("In publish Prices");
    producer.on("ready", () => {
      producer.send(payloads, function(err, data) {
        if (err) {
          console.error(err);
          return;
        }
        else
        {
        console.log(data);
        return;
        }
        
      });
    });
   /* producer.on("error", err => {
      console.error(err);
      flag = true;
    });
    setTimeout(() => {
      console.log("Attempting publishing again after 1 sec....");
    }, 100);*/
  
}

/**
 * Update new prices of each company in company collection in database
 * @param {Object} newPrices
 */
async function updatePrices(newPrices) {
  
  for (comp in newPrices) {
    console.log(comp);
    const companyOrig = await Company.findOne({name:comp});
    console.log(companyOrig);
    companyOrig.price = newPrices[comp];
    await companyOrig.save();
   // await company.updateOne({ name: comp }, { price: newPrices[comp] });
  }
}

/**
 * publish spread to the kafka messagebroker
 * @param {Object} spread object conaining new prices for each in key-value pairs
 */
function publishSpread(spread) {
  
    console.log("publishSpread");
  
    payloads = {
      topic: "Spread",
      messages: JSON.stringify(spread),
      partition: 0
    };
    producer.on("ready", () => {
      producer.send(payloads, function(err, data) {
        if (err) {
          console.error(err);
        
          return;
        } else {
          console.log(data);
          return;
        }
      });
    });
   /* producer.on("error", err => {
      console.error(err);
      
    });*/
   /* setTimeout(() => {
      console.log("Attempting publishing again after 1 sec....");
    }, 100);
}*/
}

module.exports = {
  publishPrices: publishPrices,
  publishSpread: publishSpread,
  updatePrices: updatePrices
};
