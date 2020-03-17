const express = require("express");
const request = require("request");
const { auth } = require("../../middleware/auth");
const { User } = require("../../database/models");

const loginRouter = express.Router();

/***************************************** LOGIN PATHS *****************************************/
loginRouter.get("/login", (_req, res) => {
  res.send("<h1>Login page<h1>");
});

loginRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    res.cookie("Authorization", token, { httpOnly: true, maxAge: 86400000 });
    res.status(302).redirect("/profile");
  } catch (error) {
    res.status(400).send("Invalid Credentials!");
  }
});

/***************************************** REGISTER PATHS *****************************************/
loginRouter.get("/register", (req, res) => {
  res.status(200).send("<h1>Registration page<h1>");
});

loginRouter.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
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
        res.cookie("Authorization", token, {
          httpOnly: true,
          maxAge: 86400000
        });
        res.status(201).send(body);
      }
    });
  } catch (error) {
    let responseData = error;
    if ("errmsg" in error) {
      responseData = error.errmsg;
    } else if ("errors" in error) {
      responseData = "";
      for (key in error.errors) {
        responseData += error.errors[key].reason + "\n";
      }
    }
    res.status(400).send(responseData);
  }
});

loginRouter.get("/updatePassword", auth, (_req, res) => {
  res.status(200).send("password update page");
});

loginRouter.post("/updatePassword", auth, async (req, res) => {
  try {
    let user = await User.findById(req._id);
    user.password = req.body.password;
    await user.save();
    res.status(302).redirect("/profile");
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = { loginRouter: loginRouter };
