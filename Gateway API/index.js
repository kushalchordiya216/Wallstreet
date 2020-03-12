// dependencies
const express = require("express");
const { loginRouter } = require("./src/Router/login");
const { profileRouter } = require("./src/Router/profile");
const { tradeRouter } = require("./src/Router/trade");

const cookieParser = require("cookie-parser");

// constants
const server = express();
const PORT = process.env.PORT || 3000;

// configure
server.use(express.json());
server.use(cookieParser());
server.use(loginRouter);
server.use(profileRouter);
server.use(tradeRouter);

server.listen(PORT, () => {
  console.log(`Gateway API up & running at port ${PORT}....`);
});
