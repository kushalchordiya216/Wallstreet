const express = require("express");

const profileServer = express();
const PORT = process.env.PORT || 3001;

profileServer.get("/editProfile", (req, res) => {
  // display interface for editing user profile
  // res.send()
});

//TODO: allow APIs to edit profile
profileServer.post("/editProfile", (req, res) => {
  // accept changes to profile schema objects like email, avatar pic, bio, etc.
});

profileServer.get("/profile", (req, res) => {
  // display user profile, by fetching it from profile db
});

//TODO: act as consumer to pricing stream to constantly update users networth in the background

profileServer.listen(PORT, () => {
  console.log(`User Profile service Running on ${PORT}....`);
});

//TODO: ANNOUNCE TO SERVICE DISCOVERY
