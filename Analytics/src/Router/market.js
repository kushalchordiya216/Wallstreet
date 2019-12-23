const express = require("express");
const marketRouter = express.Router();

marketRouter.get("/analysis", (req, res) => {
  //TODO: Send relevant info such as
  //- overall trade volume
  //- most active players
  //- leader board
  //- expected direction (bearish/bullish)
});

function aggregateFunction() {
  setInterval(() => {
    //TODO: aggregate all relvant data and make changes accordingly to the db
  }, 60000);
}
module.exports = { marketRouter: marketRouter };
