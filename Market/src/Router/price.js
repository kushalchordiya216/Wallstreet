const express = require("express");

const priceRouter = express.Router();

//TODO: run periodically and analyze all required factor to determine change in stock price
//TODO: publish new prices to message queue

module.exports = { priceRouter: priceRouter };
