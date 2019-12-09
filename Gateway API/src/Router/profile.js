const express = require("express");
const auth = require("../../middleware/auth");
const { User, userSchema } = require("../../database/models");
require("../../database/connector");

const profileRouter = express.Router();
profileRouter.use(auth);

profileRouter.get("/profile", (req, res) => {
  res.send("Profile page");
});

profileRouter.get("/logout", async (req, res) => {
  try {
    User.update(
      { _id: req.user._id },
      { $pull: { tokens: { token: req.user.token } } }
    );
    res.clearCookie("Authorization");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
});

profileRouter.get("/editProfile", (req, res) => {
  res.send("Profile editing page");
});

// TODO: set up API call to profile service to edit profile
// ? the database is shared, external API call maynot be necesarry, edit it right here ?
