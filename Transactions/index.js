//Environment variables
const result = require("dotenv").config({ path: "./config/dev.env" });
console.table(result);

// imports
const express = require("express");
const { rollback, rollbackRouter } = require("./src/controller/rollback");
require("../../database/connector");

// constants
const server = express();
const PORT = process.env.TRANSACTION_PORT || 3002;

//Cconfigure server
server.use(express.json());
server.use(rollbackRouter);

//background tasks
require("./utils/consumers/bidsConsumers");
rollback();

server.listen(PORT, () => {
  console.log(`Transactions service listening at ${PORT}`);
});
