const express = require("express");
const companyRouter = require("./Router/company");

const analyticServer = express();
const PORT = process.env.PORT || 3003;

analyticServer.use(companyRouter);

analyticServer.listen(PORT, () => {
  console.log(`Analytics service is running on ${PORT}....`);
});
