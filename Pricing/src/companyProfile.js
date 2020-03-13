const express = require("express");
require("../database/connector");
const { Company } = require("../database/models");

// fetch transactions from the queue and use those transactions to decide new prices for the stocks
// new prices are updated in the db, ot published publicly
const router = express.Router();

router.get("/profile", async (req, res) => {
  // send the profile of the requested company
  const name = req.body.name;
  const company = await Company.findOne({ name: name });
  console.log(company);
  res.send(company);
});

module.exports = {
  router: router
};
