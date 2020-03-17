const express = require("express");
const request = require("request");
const { auth } = require("../../middleware/auth");

const tradeRouter = express.Router();

tradeRouter.get("/trade", auth, async (req, res) => {
  res.send("trading terminal");
});

tradeRouter.get("/trade/:company", auth, async (req, res) => {
  const company = req.params.company;
  console.log(company);
  const options = {
    uri: `http://localhost:${process.env.PRICING_PORT}/profile/`,
    method: "GET",
    json: true,
    body: {
      name: company
    }
  };

  try {
    request(options, function(err, response, body) {
      if (err) {
        res.status(400).send("Company Not Present");
      } else {
        res.status(202).send(body);
      }
    });
  } catch (e) {
    res.status(400).send("Something went wrong");
  }
});

tradeRouter.post("/trade/:company", auth, async (req, res) => {
  // req.body must have same type as bidSchema, found in Profile/database/model.js/bidSchema
  req.body.company = req.params.company;
  req.body.user = req._id;
  const options = {
    uri: `http://localhost:${process.env.PROFILE_PORT}/placeBids`,
    method: "POST",
    json: true,
    body: req.body
  };
  try {
    request(options, function(err, response, body) {
      if (err) {
        res.status(400).send("Problem submitting your bid");
      } else {
        res.status(response.statusCode).send(body);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(400).send("Problem submitting your bid");
  }
});

/*
req.body must have id of the bid to be cancelled
*/
tradeRouter.post("/cancel/", auth, (req, res) => {
  const options = {
    uri: `http://localhost:${process.env.TRANSACTION_PORT}/cancel`, // request for cancellation goes directly to transactions service
    method: "POST",
    json: true,
    body: { user: req._id, _id: req.body.id, action: req.body.action }
  };
  try {
    request(options, function(err, _response, body) {
      if (err) {
        res.status(400).send("Problem processing your cancellation");
      } else {
        res.send(body);
      }
    });
  } catch (e) {}
});

module.exports = { tradeRouter: tradeRouter };
