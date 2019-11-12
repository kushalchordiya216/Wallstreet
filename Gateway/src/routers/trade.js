const express = require('express');
const {auth} = require('../../middleware/auth');
const request = require('request');

const tradeRouter = new express.Router();

tradeRouter.get('/trade', auth, (req, res) => {
  res.send('trading terminal page');
});

tradeRouter.post('/trade', auth, (req, res) => {
  // eslint-disable-next-line no-unused-vars
  const company = req.body.company;
  res.status(302).redirect(`/trade/${company}`);
});

tradeRouter.get('/trade/:company', auth, (req, res) => {
  // TODO: fetch company data from company analysis db
  // render all, asynchronously
  const company = req.params.company;
  // const options = {
  //   method: 'GET',
  //   url: `http://localhost:3002/listings/${company}`,
  //   headers: {'content-type': 'json'},
  //   json: true,
  // };
  // request(options, (error, response, body) => {
  //   res.send(body);
  // });
  res.send(company);
});

tradeRouter.post('/trade/:company', auth, (req, res) => {
  // TODO: send the appropriate bid to transactions message queue
  // from there it'll go to the appropriate DBs
});

module.exports = {
  tradeRouter: tradeRouter,
};
