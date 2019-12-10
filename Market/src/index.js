const express = require("express");

const marketServer = express();
const PORT = process.env.PORT || 3001;

marketServer.listen(PORT, () => {
  console.log(`Market service running at ${PORT} ....`);
});

//TODO: Announce yourself to service discovery
