const express = require("express");

const accountServer = express();
const PORT = process.env.PORT || 3002;

accountServer.listen(PORT, () => {
  console.log(`User Account service Running on ${PORT}....`);
});

//TODO: ANNOUNCE TO SERVICE DISCOVERY
