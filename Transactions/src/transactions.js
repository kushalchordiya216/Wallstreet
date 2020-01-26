require("../database/connector");
const { Buy, Sell, Transactions } = require("../database/models");
const {client, producer, bidConsumer, cancelConsumer } = require("./kafka");
const kafka = require('kafka-node');

/**
 * Called eveytime a new bid is fetched
 * check tables to see if there is any new transaction that can be executed
 * if found, execute appropriate transaction
 * @param {Object} bid Object must have following keys :
 *
 * - _id: bid id
 * - user: id of user making the bid
 * - company: company name
 * - action: buy/sell
 * - volume
 * - price
 */
const processTransactions = async bid => {
  let transactionStatus = "full";
  do {
    var bestSell1 = Sell.find(
      { company: bid.company }
    )
      .sort({ price: 1 })
      .limit(1);

    //This is saved as an query so you cant access object directly
    var bestBuy1 = Buy.find({ company: bid.company })
      .sort({ price: -1 })
      .limit(1);

    const bestSell2 = await bestSell1;
    const bestBuy2  = await bestBuy1;

    const bestSell  = bestSell2[0];
    const bestBuy   = bestBuy2[0];
    console.log(bestBuy);
    console.log(bestSell);

    if (bestSell.price <= bestBuy.price) {
      transactionStatus = executeTransactions(bestSell, bestBuy);
    } else {
      transactionStatus = "full";
    }
    setTimeout(() => {}, 1000); // delay make sure a single company's bids don't take up the entire event loop
  } while (transactionStatus == "partial"); // incase of partial transactions keep checking again until a bid can't be executed
  // TODO: incase of partial transactions optimize by remembering which bid was executed partially so it doesnt have to be fetched again
  // TODO: in memory redis cache
};

/**
 * function that actually executes the transaction, by checking the listed volume on each
 * @param sell sell object containng id, price, and volume of sell bid
 * @param buy buy object containng id, price, and volume of sell bid
 * @returns status of transaction as either "full" or "partial"
 */
const executeTransactions = async (sell, buy) => {
  try {
    let status = "partial";
    let buyTableUpdate, sellTableUpdate, transaction;
    const minVolume = Math.min(sell.volume, buy.volume);
    if (buy.volume === sell.volume) {
      buyTableUpdate = Buy.findByIdAndDelete(buy._id);
      sellTableUpdate = Sell.findByIdAndDelete(sell._id);
      status = "full";
    } else if (buy.volume === minVolume) {
      buyTableUpdate = Buy.findByIdAndDelete(buy._id);
      sellTableUpdate = Sell.findByIdAndUpdate(sell._id, {
        $inc: { volume: -minVolume }
      });
    } else if (sell.volume === minVolume) {
      sellTableUpdate = Sell.findByIdAndDelete(sell._id);
      buyTableUpdate = Buy.findByIdAndUpdate(buy._id, {
        $inc: { volume: -minVolume }
      });
    }
    // TODO: make schema methods on bidSchema for partial updates
    console.log("TRANNNSSSSSSSSSSSSSSSSSSSSS");
    console.log(buy);
    console.log(sell);
    //console.log(buy.company);
    let spread = (buy.price - sell.price) * minVolume;
    transaction = new Transactions({
      buyer: buy.user,
      seller: sell.user,
      company: buy.company,
      volume: minVolume,
      price: sell.price,
      spread: spread
    });
    const transactionSave = transaction.save();

    await transactionSave;
    await buyTableUpdate;
    await sellTableUpdate;
    publishTransactions(transaction);
    // send all requests first and wait for them to complete asynchronously
    return status;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Publish completed transactions/cancellation object to the relevant queue topic
 * @param transaction transaction object, which is stringified and published
 * contains following keys
 *
 * - buyer _id
 * - seller _id
 * - company name
 * - volume of trade
 * - price of transaction
 * - spread if any
 */
const publishTransactions = transaction => {
 /* payloads = [{ topic: "transactions", messages: JSON.stringify(transaction) }];
  producer.on("ready", function() {
    producer.send(payloads);
  });*/

  const client = new kafka.KafkaClient('localhost:2181');
  const bidProducer = new kafka.Producer(client);
  

payloads = [
    {
      topic:"transactions",
      messages:JSON.stringify(transaction),
      partition:0
    }
    ];
  
    bidProducer.on('ready', function(){
  
      bidProducer.send(payloads,function(err,data){
        if(err)
        {
          console.log("NOT YOO");
        }
  
        else
        {
          console.log("YOO");

        }
        
      })
  
    })

  // TODO: Handle error if message queue is down
  // TIP: look into async.queue
};

module.exports = {
  processTransactions: processTransactions
};
