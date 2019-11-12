// reuire imports
const express = require('express');
const request = require('request');

// eslint-disable-next-line no-unused-vars
const {User} = require('../../database/models');

// declare variables
const loginRouter = new express.Router();

// define routes
loginRouter.get('/login', (req, res) => {
  res.send('login');
});

loginRouter.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.cookie('Authorization', token, {maxAge: 86400000, httpOnly: true});
    res.redirect('/profile');
  } catch (e) {
    console.log(`Error: ${e}`);
  }
});

loginRouter.get('/register', (req, res) => {
  res.render('register');
});

loginRouter.post('/register', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    const token = await newUser.generateAuthToken();
    res.cookie('Authorization', token, {maxAge: 86400000, httpOnly: true});
    const reqBody = {user: newUser._id};
    const options = {
      headers: {'content-type': 'application/json'},
      url: 'http://localhost:3001/newProfile',
      body: reqBody,
      json: true,
      method: 'POST',
    };
    request(options);
    res.status(302).redirect('/profile');
  } catch (e) {
    console.log(e);
    res.status(400).send('e');
  }
  // TODO: register user in profile database
});

module.exports = {loginRouter: loginRouter};
