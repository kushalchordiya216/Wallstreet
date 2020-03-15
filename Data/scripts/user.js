const mongoose = require("mongoose");
const fs = require("fs");

let host = "localhost";
let port = 27017;
let name = "Wallstreet";

async function init() {
  try {
    await mongoose.connect(`mongodb://${host}:${port}/${name}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    let User = mongoose.connection.db.collection("users");
    let Profile = mongoose.connection.db.collection("profiles");
    await User.deleteMany({});
    await Profile.deleteMany({});
    let userData = JSON.parse(fs.readFileSync("./JSON/users.json"));
    let profileData = JSON.parse(fs.readFileSync("./JSON/profiles.json"));
    for (key in userData) {
      await User.insertOne(userData[key]);
    }
    for (key in profileData) {
      await Profile.insertOne(profileData[key]);
    }
  } catch (error) {
    console.log(error);
  }
}

init();
