// imports;
const express = require("express");
const { profileRouter } = require("./controller/profile");
const { tradeRouter } = require("./controller/trade");

//background processes
require("../database/connector");
require("../utils/consumers/cancelListener");
require("../utils/consumers/transactionListener");
require("../utils/consumers/pricesListener");

// decalre constants
const server = express();
const PORT = process.env.PORT || 3001;

// configure server
server.use(express.json());
server.use(profileRouter);
server.use(tradeRouter);

server.listen(PORT, () => {
  console.log(`Profile srver listening on port ${PORT} ....`);
});
