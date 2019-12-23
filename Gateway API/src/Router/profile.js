const express = require("express");
const request = require("request");
const { auth } = require("../../middleware/auth");
const { User, userSchema } = require("../../database/models");
require("../../database/connector");

const profileRouter = express.Router();
// profileRouter.use(auth);

profileRouter.get("/profile", auth, (req, res) => {
  const options = {
    url: "http://localhost:3001/profile",
    method: "GET",
    _id: req.user._id
  };
  request(options, function(err, response, body) {
    if (err) {
      res.status(400).send(err);
    }
    res.send(body);
  });
});

profileRouter.get("/editProfile", auth, (req, res) => {
  res.send("Profile editing page");
});

profileRouter.post("/editProfile", auth, (req, res) => {
  // TODO: set up API call to profile service to edit profile
  const options = {
    url: "http://localhost:3001/editProfile",
    method: "POST",
    form: req.body
  };
  request(options, function(err, response, body) {
    if (err) {
      res.status(400).send(err);
    }
    res.send(body);
  });
});

profileRouter.get("/logout", auth, async (req, res) => {
  try {
    User.update(
      { _id: req.user._id },
      { $pull: { tokens: { token: req.user.token } } }
    );
    res.clearCookie("Authorization");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
    res.status(400).send("Something went wrong");
  }
});

module.exports = { profileRouter: profileRouter };
