const express = require("express");
const request = require("request");
const { auth, known_tokens } = require("../../middleware/auth");
const { User } = require("../../database/models");
require("../../database/connector");

const profileRouter = express.Router();

profileRouter.get("/profile", auth, (req, res) => {
  const options = {
    url: `http://localhost:${process.env.PROFILE_PORT}/profile`,
    method: "GET",
    _id: req._id
  };
  res.setHeader("Content-Type", "application/json");
  request(options, function(err, response, body) {
    if (err) {
      res.status(400).send(err);
    }
    res.send(body);
  });
});

profileRouter.get("/history", auth, (req, res) => {
  const options = {
    url: `http://localhost:${process.env.PROFILE_PORT}/history`,
    method: "GET",
    _id: req.user._id
  };
  res.setHeader("Content-Type", "application/json");
  request(options, function(err, response, body) {
    if (err) {
      res.status(400).send(err);
    }
    res.send(body);
  });
});

profileRouter.get("/logout", auth, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req._id },
      { $pull: { tokens: { token: req.token } } }
    );
    delete known_tokens[req.token];
    res.clearCookie("Authorization");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong");
  }
});

//TODO: updateAvatar, updateBio

module.exports = { profileRouter: profileRouter };
