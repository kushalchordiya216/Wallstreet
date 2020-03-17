//imports
const express = require("express");
const cookieParser = require("cookie-parser");
const { profileRouter } = require("./Router/profile");
const { loginRouter } = require("./Router/login");
const { tradeRouter } = require("./Router/trade");

//constants
const server = express();
server.use(express.json());
server.use(cookieParser());

// add routers
server.use(profileRouter);
server.use(loginRouter);
server.use(tradeRouter);

module.exports = {
  server: server
};
