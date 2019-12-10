const express = require("express");

const analyticServer = express();
const PORT = process.env.PORT || 3003;

analyticServer.listen(PORT, () => {
  console.log(`Analytics service is running on ${PORT}....`);
});
