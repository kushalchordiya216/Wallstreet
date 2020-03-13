require("./database/connector");
const express = require("express");
const { router } = require("./src/companyProfile");
const { main } = require("./src/pricing");

//constants
const pricingServer = express();
const PORT = 3007 || process.env.PORT;

// configure server
pricingServer.use(express.json());
pricingServer.use(router);

//TODO: Spread calculation
//background tasks
setInterval(main(), 3600000);

pricingServer.listen(PORT, () => {
  console.log(`Pricing server listening at ${PORT}....`);
});
