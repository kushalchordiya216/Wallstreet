// imports
const express = require("express");
const { rollback, rollbackRouter } = require("./src/controller/rollback");
require("../../database/connector");

// constants
const server = express();
server.use(express.json());
server.use(rollbackRouter);

//background tasks
require("./utils/consumers/bidsConsumers");
rollback();

server.listen(3006, () => {
  console.log(`Transactions service listening at ${PORT}`);
});
