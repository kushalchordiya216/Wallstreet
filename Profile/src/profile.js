require("../database/connector");
const express = require("express");
const {Profile,profileSchema} = require("../database/models");
const mongoose = require('mongoose');


const profileServer = express();
const PORT = process.env.PORT || 3001;
profileServer.use(express.json());

profileServer.get("/editProfile", (req, res) => {
  // display interface for editing user profile
  // res.send()
});

//TODO: allow APIs to edit profile
profileServer.post("/editProfile", (req, res) => {
  // accept changes to profile schema objects like avatar pic, bio, etc.
});

profileServer.get("/profile", async (req, res) => {
  // display user profile, by fetching it from profile db
  //Change this later
  //
  //
  const profile = await Profile.findOne();
  console.log(profile)
  console.log(req.body._id);
  if (profile) {
    res.send(profile);
  } else {
    res.status(400).send("Login session expired, kindly login again!");
  }
});

profileServer.post("/profile", async (req, res) => {
  console.log("Creating new profile");
  console.log(req.body);
  try {
    
     
   
    const profile = new Profile(req.body);
   
    await profile.save();
    console.log("Succesful");
    res.send(profile);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//TODO: act as consumer to pricing stream to constantly update users networth in the background

profileServer.listen(PORT, () => {
  console.log(`User Profile service Running on ${PORT}....`);
});

//TODO: ANNOUNCE TO SERVICE DISCOVERY
