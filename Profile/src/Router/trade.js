const express = require("express");
const request = require("request-promise");
const { Bid, Cancel, Profile } = require("../../database/models");
const tradeRouter = express.Router();
const { publish } = require("../utils/publish");

require("../../database/connector");
require("../utils/pricesListener");
require("../utils/transactionListener");

tradeRouter.use(express.json());

tradeRouter.post("/trade/placeBids", async (req, res) => {
  //Company name can also be put as query string if required
  // To know about the different kinds of bids that can be made, see User/database/models.js/bidSchema

  const bid = new Bid(req.body);
  bid.populate("user");

  try {
    const availableCash = bid.user.availableCash;
    const userStocks = bid.user.stocks;

    /**************************************** Buy bid logic ***************************************************/
    if (bid.action === "buy") {
      //Checks if total cost + brokerage fees is available or not
      if (availableCash < bid.price * volume * 1.05) {
        res.send("Enough cash is not available").status(200);
      }

      // fetch company profile to see if current market price is within acceptable range of bid.price

      // FIXME: Possible to use the pricesConsumer to store list instead of making API calls each time

      const options1 = {
        uri: "http://localhost:3006/profile",
        method: "GET",
        body: {
          _id: JSON.stringify({ _id }),
          companyName: companyName
        },
        json: true
      };

      const company1 = await request(options1);
      let stockPrice;
      if (company1) {
        stockPrice = company1.price; //company1.stockPrice;
      } else {
        res.send("Company Not Present").status(200);
      }

      if (stockPrice / bid.price > 1.2 || stockPrice / bid.price < 0.8) {
        res.send("Bid not Allowed, exceeds circuit limit!").status(200);
      } else {
        //Save bid to DB and publish to kafka
        await bid.save();
        publish("Bid", bid);
        res.send("Buy bid placed").status(200);
      }
    } else {
      /********************************************* Sell bid logic *************************************************/
      const companyStock = userStocks.filter(stock => {
        return stock[company] === bid.company;
      });

      // check if user owns enough shares that they are trying to sell
      if (companyStock) {
        if (companyStock.volume < bid.volume) {
          res.send("Bid is invalid insufficient stocks found").status(200);
        } else {
          await bid.save();
          await publish("Bids", bid);
          res.send("Sell bid placed").status(200);
        }
      } else {
        res.send("No Stock of specified company Present").status(200);
      }
    }
  } catch (e) {
    res.send("Bid placing failed").status(404);
    console.log(e);
  }
});

tradeRouter.post("/cancel/:id", async (req, res) => {
  // cancel pending bid
  // the bid id,which is sent in the url params, will be used to find and cancel the bid
  // cancellation will also be published to a queue

  const bidId = req.params.id;
  let query = Bid.findOneAndRemove({ _id: bidId });
  try {
    const data = await query.exec();
    console.log(data);
    const cancel = new Cancel(data);
    if (data) {
      await publish("Cancelled", data);
      await cancel.save();
      res.send("Bid sucessfully cancelled").status(200);
    } else {
      res.send("Bid Not Present, may have been executed already").status(200);
    }
  } catch (e) {
    res.send("Error while cancelling").status(404);
  }
});

module.exports = {
  tradeRouter: tradeRouter
};
