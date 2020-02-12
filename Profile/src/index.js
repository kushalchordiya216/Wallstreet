// imports;
const express = require("express");
require("../database/connector");
const { profileRouter } = require("./Router/profileController");
const { tradeRouter } = require("./Router/tradeController");
require("./utils/pricesListener");
require("./utils/transactionListener");

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
