const express = require("express");
const request = require("request");
const auth = require("../../middleware/auth");
const { User, userSchema } = require("../../database/models");
require("../../database/connector");

const loginRouter = express.Router();

/***************************************** LOGIN PATHS *****************************************/
loginRouter.get("/login", (req, res) => {
  res.send("Login page");
});

loginRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.cookie("Authorization", token);
    res.redirect("/profile");
  } catch (error) {
    console.log(error);
    res.send("Invalid Credentials!");
  }
});

/***************************************** REGISTER PATHS *****************************************/
loginRouter.get("/register", (req, res) => {
  res.send("Registration page");
});

loginRouter.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();

    const options = {
      url: "http://localhost:3001/profile",
      headers: { "content-type": "application/json" },
      json: true,
      method: "POST",
      body: { _id: user._id, name: req.body.name, email: req.body.email }
    };
    request(options, function(err, response, body) {
      if (!err) {
        res.cookie("Authorization", token);
        res.send(body);
      }
      // if new profile not created, delete created user and send error message back to user
      else {
        user.remove();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = { loginRouter: loginRouter };
