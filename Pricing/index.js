const kafka = require("kafka-node");

const { accumulateTransactions, accumulateBids } = require("./src/pricing");
const { accumulateSpread } = require("./src/spread");
const { publishPrices, publishSpread, updatePrices } = require("./src/publish");

require("./database/connector");
const { Company } = require("./database/models");

/******************************************** Declare datastructures for storage *****************************************/
/**
 * array to store all sellbids fetched from broker. Each element of array is an object, with following structure
 *
 * @field company: Name of company for which sell bid was placed
 * @field price: price at which bid was placed
 * @field volume: Volume of shares up for takes
 */
let sellBidsArray = [];

/**
 * array to store all buybids fetched from broker. Each element of array is an object, with following structure
 *
 * @field company: Name of company for which buy bid was placed
 * @field price: price at which bid was placed
 * @field volume: Volume of shares up for takes
 */
let buyBidsArray = [];

/**
 * Array used to store transactions that have been fetched from kafka service
 * Each transaction object has the following structure
 *
 * @field company: Name of the company
 * @field price: price at which transaction was executed
 * @field volume: amount of shares exchanged
 * @field spread: spread, if any due to unequal bid and ask price
 */
let transactionsArray = [];

/***************************************** Set most recent Offsets for both consumers ******************************************/

const client = new kafka.KafkaClient('localhost:2181');
const client1 = new kafka.KafkaClient('localhost:2181');

const offset = new kafka.Offset(client);
const offset1 = new kafka.Offset(client1);


offset.fetch([{ topic: "Bids", partition: 0, time: -1 }], (err, data) => {
  let latestOffset = data["Bids"]["0"][0];
  console.log(`Bids offset is ${latestOffset}`);
});

offset1.fetch(
  [{ topic: "transactions", partition: 0, time: -1 }],
  (err, data) => {
    console.log(`Transactions offset is ${data["transactions"]["0"][0]}`);
  }
);

/******************************************* Consume data from both topics **************************************/



const bidsConsumer = new kafka.Consumer(client, 
  [{ topic: 'Bids', partition: 0 }],
  
  
);

bidsConsumer.on("message", async function(message) {
  console.log("Bids");
  const bid = JSON.parse(message.value);
  if (bid.action == "sell") {
    sellBidsArray.push(bid);
  } else {
    buyBidsArray.push(bid);
  }
  console.log(bid)
});

const transactionsConsumer = new kafka.Consumer(client1,
   
 [{ topic: 'transactions', partition: 0 }],
  
);

transactionsConsumer.on("message",async function(message) {
  const transaction = JSON.parse(message.value);
  console.log("Consumer");
  console.log(transaction);
  transactionsArray.push(transaction);
});

/*********************************************** Main function for pricing and spread ********************************************/

/**
 *
 */

async function main() {
  setInterval(async () => {
    // pause both consumers momentarily to not have asynchronous ops on the datastructures defined above
   // bidsConsumer.pause();
    //transactionsConsumer.pause();
    console.log(transactionsArray);
    // accumulate prices and spreads
    let newPrices = accumulateTransactions(transactionsArray);
    let spread = accumulateSpread(transactionsArray);
    transactionsArray = []; // reset transactionArray to not count any transactions twice
    
    // fetch existing prices from db
    let currentPricesArr = await Company.find({});// Company.find({},'name price');
    
    let currentPricesObj = {}
    for (let index = 0; index < currentPricesArr.length; index++) {
      currentPricesObj[currentPricesArr[index].name] = currentPricesArr[index].price;
      
    }
    console.log(currentPricesObj["bosch"]);

    // analyse demand and supply based on buy and sell bids
    console.log(buyBidsArray);
    console.log(sellBidsArray);
    let bidRates = accumulateBids(
      buyBidsArray,
      sellBidsArray,
      currentPricesObj
    );
    console.log(bidRates);
    for (company in bidRates) {
      console.log(company);
      if (!(company in newPrices)) {
        newPrices[company] = 0;
      }
      newPrices[company] += 0.1 * bidRates[company];
    }
    
    console.log(newPrices);

    //Reset them as they could be resused to carry out changes in prices

    buyBidsArray = [];
    sellBidsArray = [];

    // publish changes and update database
    publishPrices(newPrices);
    publishSpread(spread);
    updatePrices(newPrices);
    
    // resume consuming 
    bidsConsumer.resume();
    transactionsConsumer.resume();
    console.log("Alright");
  }, 30000);//60000
}

/************************************************** Call the main function *************************************************/
main();
