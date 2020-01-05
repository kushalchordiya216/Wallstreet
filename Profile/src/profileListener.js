/*
**This can be run as a standalone script when the server is setup
**we wont need to integrate inside the Express Server
*/


const kafka = require('kafka-node')
const Profile = require('../database/models')


//const updateProfile = () => {


while(true)
{

try {
  const Consumer = kafka.HighLevelConsumer;
  const client = new kafka.KafkaClient({kafkaHost: '#Whatever the address'});
  let consumer = new Consumer(
    client,
    [{ topic:'profile', partition: 0 }],
    {
      autoCommit: false
    }
  );
  consumer.on('message', async function(message) {
    
    const profile = JSON.parse(message.value);

    const newProfile = new Profile(profile);

    const oldProfile = await Profile.findOne({_id:newProfile._id});

    Object.assign(oldProfile,newProfile);

    await oldProfile.save();

  })
  consumer.on('error', function(err) {
    console.log('error', err);
  });
}
catch(e) {
  console.log(e);
}

}

//}

//module.exports = updateProfile