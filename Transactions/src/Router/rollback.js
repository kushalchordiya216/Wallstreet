require("../../database/connector");
const { Buy, Sell } = require("../../database/models");
const kafka = require("kafka-node");

const rollback = () => {
  // check buy tables and sell tables for bids older than 30 minutes and remove them
};

const publishRollback = () => {
  // publish rollbacks to message queue
};

module.exports = {
  rollback: rollback,
  publishRollback: publishRollback
};
