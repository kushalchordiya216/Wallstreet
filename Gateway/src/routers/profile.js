const express = require('express');
const {auth} = require('../../middleware/auth');
const request = require('request');

const profileRouter = new express.Router();

profileRouter.get('/profile', auth, (req, res) => {
  // TODO: fetch user data from profile service bus / message queue
  // use user _id obj
  // Render page with name, networth, current portfolio
  const options = {
    method: 'GET',
    headers: {'content-type': 'application/json'},
    url: 'http://localhost:3001/profile',
    json: true,
    body: {_id: req.user._id},
  };
  request.get(options, (error, response, body) => {
    res.send(body);
  });
});

profileRouter.get('/profile/editProfile', (req, res) => {
  res.send('Edit profile details');
});

profileRouter.post('/profile/editProfile', (req, res) => {
  console.log(req.body);
  const options = {
    method: 'PATCH',
    headers: {'content-type': 'application/json'},
    url: 'http://localhost:3001/editProfile',
    json: true,
    body: req.body,
  };
  request(options, (error, response, body) => {
    if (response.statusCode == 200) {
      res.send(body);
    } else {
      res.status(400).send('Request failed');
    }
  });
});
// TODO: view and cancel transactions
module.exports = {profileRouter: profileRouter};
