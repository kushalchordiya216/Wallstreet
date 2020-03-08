const express = require("express");

require("../database/connector");
const { Company } = require("../database/models");

// fetch transactions from the queue and use those transactions to decide new prices for the stocks
// new prices are updated in the db, ot published publicly
const pricingServer = express();
pricingServer.use(express.json());
const PORT = process.env.PORT || 3006;

pricingServer.get("/profile", async (req, res) => {
  // send the profile of the requested company
  const name = req.body.name;
  console.log(name);
  const company = await Company.findOne({ name: name });
  console.log(company);
  res.send(company);
});

//TODO: consume from transactions message queue and decide prices for each market

pricingServer.listen(PORT, () => {
  console.log(`Pricing service runnin on ${PORT}....`);
});
