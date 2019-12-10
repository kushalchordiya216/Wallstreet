const express = require("express");

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
    res.cookie("Authorization", token);
    res.redirect("profile");
  } catch (error) {
    res.send("Something went wrong please try again!\n");
  }
  //TODO: create new profile for every registered user with default net worth
});

module.exports = { loginRouter: loginRouter };
