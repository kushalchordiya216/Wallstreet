const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/Wallstreet", {
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
