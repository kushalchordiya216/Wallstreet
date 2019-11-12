const path = require('path');

const express = require('express');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');

require('../database/connector');
const {loginRouter} = require('./routers/login');
const {profileRouter} = require('./routers/profile');
const {tradeRouter} = require('./routers/trade');
const {analyticsRouter} = require('./routers/analytics');

// declare variables
const server = express();
const PORT = process.env.PORT || 3000;
const staticFilesDir = path.join(__dirname, '../public');
const partialsPath = path.join(__dirname, '../templates');
const viewsPath = path.join(__dirname, '../templates/views');

// server config
server.set('view engine', 'hbs');
server.set('views', viewsPath);
server.use(express.json());
server.use(express.static(staticFilesDir));
server.use(cookieParser());
server.disable('x-powered-by');
hbs.registerPartials(partialsPath);

// set up routers
server.use(loginRouter);
server.use(profileRouter);
server.use(tradeRouter);
server.use(analyticsRouter);

server.get('/', (req, res) => {
  res.send('Wallstreet');
});

server.get('*', (req, res) => {
  res.send('404');
});

server.listen(PORT, () => {
  console.log(`Gateway running on port ${PORT} ....`);
});
