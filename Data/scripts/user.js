const mongoose = require("mongoose");
const { userSchema } = require("../../Gateway API/database/models");
const { profileSchema } = require("../../Profile/database/models");
const fs = require("fs");

let host = "localhost";
let port = 27017;
let name = "Wallstreet";

async function init() {
  try {
    await mongoose
      .connect(`mongodb://${host}:${port}/${name}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(() => {
        console.log("connected");
      });

    const User = mongoose.model("users", userSchema);
    const Profile = mongoose.model("profile", profileSchema);
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
  } catch (error) {
    //console.log(error);
  }
}

init();
