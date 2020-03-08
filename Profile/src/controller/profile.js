const express = require("express");
require("../../database/connector");
const { Profile, Bid } = require("../../database/models");

const profileRouter = express.Router();
profileRouter.use(express.json());

//TODO: allow APIs to edit profile
profileRouter.post("/editProfile", async (req, res) => {
  // accept changes to profile schema objects like avatar pic, bio, etc.
  let result = await Profile.updateOne({ _id: req.body._id }, req.body);
  // if this doesn't work as accepted, use schema method defined for profile schema in model.js
  res.send(result);
});

//TODO: paginate this view
profileRouter.get("/history", async (req, res) => {
  // fetch user transaction history
  let history = await Bid.find({ _id: req.body._id });
  res.send(history);
});

profileRouter.get("/profile", async (req, res) => {
  // display user profile, by fetching it from profile db
  const profile = await Profile.findOne();
  if (profile) {
    res.send(profile);
  } else {
    res.status(400).send("Login session expired, kindly login again!");
  }
});

profileRouter.post("/profile", async (req, res) => {
  console.log("Creating new profile");
  console.log(req.body);
  try {
    const profile = new Profile(req.body);
    await profile.save();
    res.send(profile);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// TODO: populate kafka for testing

module.exports = { profileRouter: profileRouter };
