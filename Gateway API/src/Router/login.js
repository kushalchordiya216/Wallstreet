const express = require("express");
const request = require("request");
const { auth } = require("../../middleware/auth");
const { User } = require("../../database/models");
require("../../database/connector");

const loginRouter = express.Router();

/***************************************** LOGIN PATHS *****************************************/
loginRouter.get("/login", (_req, res) => {
  res.send("Login page");
});

loginRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log(user);

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
      url: `http://localhost:${process.env.PROFILE_PORT}/profile`,
      headers: { "content-type": "application/json" },
      json: true,
      method: "POST",
      body: { _id: user._id, name: req.body.name, email: req.body.email }
    };
    request(options, async function(err, response, body) {
      if (response.statusCode == 400 || err) {
        await user.remove();
        res.status(400).send("Problem creating your profile" + err);
      } else {
        res.cookie("Authorization", token);
        res.send(body);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

loginRouter.get("/updatePassword", auth, (_req, res) => {
  res.send("password update page");
});

loginRouter.post("/updatePassword", auth, async (req, res) => {
  try {
    let user = await User.findById(req._id);
    user.password = req.body.password;
    await user.save();
    res.send("password successfully updated!\n");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = { loginRouter: loginRouter };
