const express = require("express");
require("../../database/connector");
const mongoose = require("mongoose")
const objectid = mongoose.Types.ObjectId
const { Profile, Bid } = require("../../database/models");

const profileRouter = express.Router();
profileRouter.use(express.json());

//TODO: paginate this view
profileRouter.get("/history", async (req, res) => {
  // fetch user transaction history
  let history = await Bid.find({ _id: req.body._id });
  res.send(history);
});

profileRouter.get("/profile", async (req, res) => {
  // display user profile, by fetching it from profile db
  const name = req.body.name
  console.log(name)
  //TODO: Below query was not working for me fix it
  //Profile.findOne({name:name});

  const profile = await Profile.findOne({name:"nikhil"});
  console.log(profile)
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

profileRouter.get("/leaderboard", async (req, res) => {
  try {
    const allProfiles = await Profile.find({}, "user netWorth")
      .sort({
        stockWorth: -1
      })
      .limit(10);
    if (allProfiles) {
      res.send(allProfiles);
    } else {
      res.send("No Profiles Found").status(404);
    }
  } catch (error) {
    console.log(error);
    res.send().status(404);
  }
});

// TODO: populate kafka for testing

module.exports = { profileRouter: profileRouter };
