const express = require('express');
const bodyParser = require('body-parser');

require('../database/connector');
const {Profile} = require('../database/models');

const server = express();
const PORT = process.env.PORT || 3001;

server.use(bodyParser.json());

server.get('/getProfile', async (req, res) => {
  const profile = await Profile.findOne({user: req.body._id});
  console.log(profile);
  res.send(profile);
});

server.post('/setProfile', async (req, res) => {
  try {
    console.log('Creating profile');
    const profile = new Profile(req.body);
    await profile.save();
    res.status(201).send('New Profile Created successfully!');
  } catch (e) {
    console.log(e);
    res.status(400).send('Profile broke DB constraints!\n');
  }
});

// TODO: editProfile
// TODO: view and cancel pending transactions

server.listen(PORT, () => {
  console.log(`Profile service is running at ${PORT}....`);
});
