//environment variales
const config = require("dotenv").config({ path: "./config/dev.env" });
console.table(config);

//Imports
require("./database/connector");
const express = require("express");
const { router } = require("./src/companyProfile");
const { pricing } = require("./src/pricing");

//constants
const pricingServer = express();
const PORT = process.env.PRICING_PORT || 3003;

// configure server
pricingServer.use(express.json());
pricingServer.use(router);

//TODO: Spread calculation
//background tasks
setInterval(pricing, 3600000);

pricingServer.listen(PORT, () => {
  console.log(`Pricing server listening at ${PORT}....`);
});
