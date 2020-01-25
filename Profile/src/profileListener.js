/*
**This can be run as a standalone script when the server is setup
**we wont need to integrate inside the Express Server
*/


const kafka = require('kafka-node')
const { Profile1 , profileSchema } = require('../database/models')


const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Wallstreet", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Connection established with DB");
  })
  .catch(error => {
    console.log(`Error in conecting to database!\n${error}`);
  });

const Profile = mongoose.model("profile",profileSchema);


const updateProfile = () => {


try {
 
  const client = new kafka.KafkaClient('localhost:2181');
  let consumer = new kafka.Consumer(
    client,
    [{ topic:'profile', partition: 0 }],
    {
      autoCommit: false
    }
  );
  console.log("ProfileListener is Online");
  consumer.on('message', async function(message) {
    
   

    const newProfile = JSON.parse(message.value);

    console.log(newProfile);

    const oldProfile = await Profile.findById(newProfile._id);

    Object.assign(oldProfile,newProfile);

    await oldProfile.save();
    console.log("Profile Updated");

  })
  consumer.on('error', function(err) {
    console.log('error', err);
  });
}
catch(e) {
  console.log(e);
}


}

updateProfile();