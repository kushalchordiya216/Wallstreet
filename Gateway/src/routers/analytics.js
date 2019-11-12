const express = require('express');
const request = require('request');

const auth = require('../../middleware/auth');

const analyticsRouter = new express.Router();

analyticsRouter.get('/profile/analytics', auth, (req, res) => {
  const options = {
    method: 'GET',
    url: 'http://localhost:3003/profile',
    json: true,
    body: {_id: req.user._id},
    headers: {'content-type': 'application/json'},
  };
  request(options, (error, response, body) => {
    if (response.statusCode == 200) {
      res.status(200).send(body);
    } else {
      res.status(400).send(error);
    }
  });
});

analyticsRouter.get('/:companyName/analytics', auth, (req, res) => {
  const options = {
    method: 'GET',
    url: 'http://localhost:3003/profile',
    json: true,
    body: {_id: req.params.companyName},
    headers: {'content-type': 'application/json'},
  };

  request(options, (error, response, body) => {
    if (response.statusCode == 200) {
      res.status(200).send(body);
    } else {
      res.status(400).send(error);
    }
  });
});

module.exports = {analyticsRouter: analyticsRouter};
