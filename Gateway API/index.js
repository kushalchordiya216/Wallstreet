//environment variables
let result = require("dotenv").config({ path: "./config/dev.env" });
console.table(result.parsed);
// imports
const path = require("path");
const { server } = require("./src/server");
const express = require("express");
require("./database/connector");

// constants
const PORT = process.env.GATEWAY_PORT || 3000;
const publicDirectory = path.join(__dirname, "./public");
console.log(publicDirectory);

// set up frontend files path
server.use(express.static(publicDirectory));

server.listen(PORT, () => {
  console.log(`Gateway API up & running at port ${PORT}....`);
});
