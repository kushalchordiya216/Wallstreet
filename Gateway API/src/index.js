// dependencies
const express = require("express");
const { loginRouter } = require("./Router/login");
const { profileRouter } = require("./Router/profile");

const cookieParser = require("cookie-parser");
const auth = require("../middleware/auth");

// constants
const server = express();
const PORT = process.env.PORT || 3000;

// config
server.use(express.json());
server.use(cookieParser());
server.use(loginRouter);
server.use(profileRouter);

server.listen(PORT, () => {
  console.log(`Gateway API up & running at port ${PORT}....`);
});
