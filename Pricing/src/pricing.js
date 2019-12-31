const express = require("express");
const kafka = require("kafka-node");
const { Company } = require("../database/models");

// fetch transactions from the queue and use those transactions to decide new prices for the stocks
// new prices are updated in the db, ot published publicly
const pricingServer = express();
const PORT = process.env.PORT || 3006;


pricingServer.get("/profile/:company", (req, res) => {
  // send the profile of the requested company, mainly the price
});

pricingServer.get("/index", (req, res) => {
  // send back paginated view of company profiles
});

//TODO: consume from transactions message queue and decide prices for each market

pricingServer.listen(PORT, () => {
  console.log(`Pricing service runnin on ${PORT}....`);
});
