const express = require("express");
const request = require("request-promise");
const { Bid, Profile } = require("../../database/models");
const tradeRouter = express.Router();
const { publish } = require("../../utils/producers/publish");

tradeRouter.use(express.json());

tradeRouter.post("/placeBids", async (req, res) => {
  const bid = new Bid(req.body);
  let profile = await Profile.findById(bid.user);
  try {
    const availableCash = profile.cash;
    const userStocks = profile.stocks;

    const options1 = {
      uri: `http://localhost:${process.env.PRICING_PORT}/profile`,
      method: "GET",
      body: {
        name: bid.company
      },
      json: true
    };

    const company1 = await request(options1);
    let stockPrice = 0;
    if (company1) {
      stockPrice = company1.price;
    } else {
      res.status(406).send("Company Not Present");
      return;
    }

    if (stockPrice * 1.2 < bid.price || stockPrice * 0.8 > bid.price) {
      res.status(406).send("Bid not Allowed, exceeds circuit limit!");
      return;
    }

    /**************************************** Buy bid logic ***************************************************/
    if (bid.action === "buy") {
      if (availableCash < bid.price * bid.volume * 1.05) {
        res.status(406).send("Enough cash is not available");
        return;
      }
      await bid.save();
      await publish("Bids", bid);

      res.status(202).send("Buy bid placed");
      return;
    } else {
      /********************************************* Sell bid logic *************************************************/
      let companyStock = userStocks.filter(stock => {
        return stock.company === bid.company;
      });
      companyStock = companyStock[0];

      if (companyStock) {
        if (companyStock.volume < bid.volume) {
          res.status(406).send("Bid is invalid insufficient stocks found");
          return;
        } else {
          await bid.save();
          await publish("Bids", bid);
          res.status(202).send("Sell bid placed");
          return;
        }
      } else {
        res
          .status(406)
          .send("No Stock of specified company Present in portfolio");
        return;
      }
    }
  } catch (e) {
    res.status(406).send("Bid placing failed");
    return;
  }
});

module.exports = {
  tradeRouter: tradeRouter
};
