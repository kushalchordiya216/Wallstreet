const express = require("express");
const kafka = require("kafka-node");

require("../database/connector");
const {Company}  = require("../database/models");

// fetch transactions from the queue and use those transactions to decide new prices for the stocks
// new prices are updated in the db, ot published publicly
const pricingServer = express();
pricingServer.use(express.json());
const PORT = process.env.PORT || 3006;


pricingServer.get("/profile", async(req, res) => {
  // send the profile of the requested company, mainly the price

  const cname = req.body.companyName;
  console.log(cname);
  const company = await Company.findOne({name:cname}); 
  console.log(company);
  res.send(company);


});
/*
pricingServer.get("/index", (req, res) => {
  // send back paginated view of company profiles
});*/

//TODO: consume from transactions message queue and decide prices for each market

pricingServer.listen(PORT, () => {
  console.log(`Pricing service runnin on ${PORT}....`);
});
