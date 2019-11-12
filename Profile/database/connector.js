const mongoose = require('mongoose');
mongoose
    .connect('mongodb://localhost:27017/Wallstreet', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(
        () => {
          console.log('Connection established with DB');
        },
        (error) => {
          console.log(`Error establishing connection with DB: ${error}`);
        },
    );
