const express = require("express");

const rollbackServer = express();
const PORT = process.env.PORT || 3006;

const rollback = () => {
  //TODO: run periodically every minute and remove all transactions that are older than 30 minutes
};

const publishRollbacks = () => {
  //TODO: publish rollback transactions as cancelled transactions
};

rollbackServer.listen(PORT, () => {
  console.log(`Rollback service running on ${PORT} ....`);
});
