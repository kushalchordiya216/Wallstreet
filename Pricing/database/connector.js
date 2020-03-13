const mongoose = require("mongoose");

let port = process.env.DB_PORT;
let host = process.env.DB_HOST;
let name = process.env.DB_NAME;

mongoose
  .connect(`mongodb://${host}:${port}/${name}`, {
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
