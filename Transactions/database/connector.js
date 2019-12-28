const mongoose = require("mongoose");

mongoose
  .connect(process.env.mongodbdev, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Connection established with DB");
  })
  .catch(error => {
    console.log(`Error in conecting to database!\n${error}`);
  });
