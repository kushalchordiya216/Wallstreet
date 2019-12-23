//TODO: Fetch from transactions stream to update portfolio constantly, adding and removing necesarry stocks

const express = require("express");

const portfolioServer = express();
const PORT = process.env.PORT || 3003;

portfolioServer.listen(PORT, () => {
  console.log(`User Portfolio service Running on ${PORT}....`);
});

//TODO: ANNOUNCE TO SERVICE DISCOVERY
