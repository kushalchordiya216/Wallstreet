const { bids } = require("../utils/consumers/bidsConsumer");
const { transactions } = require("../utils/consumers/transactionsConsumer");
const { publish } = require("../utils/producers/publish");
const { Company } = require("../database/models");

async function updatePrices(finalPrices) {
  let queries = [];
  for (company in finalPrices) {
    let query = {
      updateOne: {
        filter: {
          name: company
        },
        update: { price: finalPrices[company] }
      }
    };
    queries.push(query);
  }
  await Company.bulkWrite(queries);
}

async function main() {
  let newRates = transactions();
  let [cashflow, currentPrices] = bids();
  let finalPrices = {};
  for (company in currentPrices) {
    if (company in newRates) {
      finalPrices[company] = newRates[company];
    }
    if (company in cashflow) {
      if (!(company in finalPrices)) {
        finalPrices[company] = currentPrices[company];
      }
      finalPrices[company] += cashflow[company];
    }
  }
  updatePrices(finalPrices);
  publish("Prices", finalPrices);
}

module.exports = { main: main };
