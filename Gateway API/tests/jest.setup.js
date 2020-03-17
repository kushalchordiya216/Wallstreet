const mongoose = require("mongoose");
const fs = require("fs");
const { userSchema } = require("../database/models");
const { profileSchema } = require("../../Profile/database/models");
const configuration = require("dotenv").config({ path: "./config/dev.env" });
console.table(configuration);

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1/Wallstreet", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  });

  let User = new mongoose.model("users", userSchema);
  let Profile = new mongoose.model("profiles", profileSchema);

  await User.deleteMany({});
  await Profile.deleteMany({});
  let userData = JSON.parse(
    fs.readFileSync(
      "/home/kushal/Workspace/JavaScript/Wallstreet/Data/JSON/users.json"
    )
  );
  let profileData = JSON.parse(
    fs.readFileSync(
      "/home/kushal/Workspace/JavaScript/Wallstreet/Data/JSON/profiles.json"
    )
  );
  for (key in userData) {
    let user = new User(userData[key]);
    profileData[key]["_id"] = user._id;
    let profile = new Profile(profileData[key]);
    await user.save();
    await profile.save();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
