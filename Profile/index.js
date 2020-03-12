// imports;
const express = require("express");
const { profileRouter } = require("./src/controller/profile");
const { tradeRouter } = require("./src/controller/trade");

//background processes
require("./database/connector");
require("./utils/consumers/cancelListener");
require("./utils/consumers/transactionListener");
require("./utils/consumers/pricesListener");

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
