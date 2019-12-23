const express = require("express");

const companyRouter = express.Router();

companyRouter.get("/:company", (req, res) => {
  //TODO: fetch relevant companies analytics such as stock trends, trade volume, etc.
});

(function aggregateFunction() {
  setInterval(() => {
    //TODO: function that aggregates data from relevant queues to give analysis of stocks
  }, 60000);
})();
// called as soon as module is required in index.js file

module.exports = {
  companyRouter: companyRouter
};
