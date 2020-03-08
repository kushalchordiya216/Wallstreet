const express = require("express");
const request = require("request");
const { auth, known_tokens } = require("../../middleware/auth");
const { User } = require("../../database/models");
require("../../database/connector");

const tradeRouter = express.Router();

tradeRouter.get("/trade", auth, async (req, res) => {
  res.send("trading terminal");
});

tradeRouter.get("/trade/:company", auth, async (req, res) => {
  const company = req.params.company;
  const options = {
    uri: "http://localhost:3006/profile/",
    method: "GET",
    body: {
      name: company
    }
  };

  try {
    request(options, function(err, response, body) {
      if (err) {
        res.status(400).send("Company Not Present");
      } else {
        res.send(data);
      }
    });
  } catch (e) {
    res.send("Something went wrong").status(404);
  }
});

tradeRouter.post("trade/:company", auth, async (req, res) => {
  // req.body must have same type as bidSchema, found in Profile/database/model.js/bidSchema
  const options = {
    uri: "http://localhost:3001/placeBids/",
    method: "POST",
    body: req.body
  };
  try {
    request(options, function(err, _response, body) {
      if (err) {
        res.status(400).send("Problem submitting your bid");
      } else {
        res.send(body);
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
    uri: "http://localhost:3006/cancel", // request for cancellation goes directly to transactions service
    method: "POST",
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
