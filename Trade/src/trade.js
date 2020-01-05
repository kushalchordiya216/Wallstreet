const express = require("express");
const kafka = require("kafka-node");
const request = require("request");
const bidProducer = require("./kafka")
const publish = require("./publish")

require("../database/connector");
const { Bid, Cancel } = require("../database/models");
const tradeServer = express();
const PORT = process.env.PORT || 3002;

tradeServer.get("/trade", async(req, res) => {
  // Basic trading terminal page, allows user to select a company to trade stocks of

  const options = {

      url:"http://localhost:3000/index",
      method:"GET",
      _id:"req._id"

  };

  request(options, function(err,response,body) {

    if(err)
    {
      res.send("Something went wrong").status(404);
    }

    res.send(body).status(200);

  })
  

});

tradeServer.get("/trade/:company", async(req, res) => {
  // trade terminal for a particular company, will fetch and store company financials (current price)

  //Once fetched this data cant be modified so when user requests to bid we will fetch updated price and
  //show him updated price

  // ? how/where do i store it

  const companyName = req.body.companyName;

  const options = {
    url:"http://localhost:3000/profile/"+ companyName ,
    method:"GET",
    _id:"req._id"
  }

  request(options, function(err,response,body){

    if(err)
    {
      res.send("Something went wrong").status(404);
    }

    res.send(body).status(200);

  })

});

tradeServer.post("/trade/:company", async(req, res) => {
  // TODO: Allow user to make bids, includes authenticating the bid by checking user financials and existing stock
  // TODO: publish all to kafka stream
  // To know about the different kinds of bids that can be made, see User/database/models.js/bidSchema

  const _id = req._id;
  const bidPrice = req.body.bidPrice;
  const volume = req.body.volume;
  const action = req.body.action;
  const type = req.body.type;

  //Company name can also be put as query string if required
  //const companyName = req.query.companyName

  const companyName = req.body.companyName;


  const options = {
    url:"http://localhost:3000/profile/",
    method:"GET",
    body:JSON.stringify({_id})
  }

  request(options, function(err,response,body){

    if(err)
    {
      res.send("Something went wrong").status(404);
    }

    const profile = body;
    const availableCash = profile.availableCash;
    const userStocks = profile.stocks; 

  })

  if(action === "buy")
  {

    //Checks if total cost + brokerage fees is available or not


    if(availableCash < (bidPrice*volume)+((bidPrice*volume)/100*5))
    {
      res.send("Enough cash is not available").status(200);
    }
    


  const options = {
    url:"http://localhost:3000/profile/"+ companyName ,
    method:"GET",
    _id:"req._id"
  }

  request(options, function(err,response,body){

    if(err)
    {
      res.send("Something went wrong").status(404);
    }

    const stockPrice = body.stockPrice

    //Maximum limit price 
    //
    //

    if((stockPrice-bidPrice) > 40)
    {
      res.send("Bid not Allowed").status(200)
    }

    //Limit bid
    if(type === "limit")
    {

      const finalBid = new Bid({
      user:_id,
      company:companyName,
      volume:volume,
      price:bidPrice,
      category:"limit",
      action:"buy"});

      /*Once Bid is suceesfully placed 5% of available cash is removed from user profile as brokerage

      **IF available cash is deducted then user has to have lockedcash amount to sustain the trade

      */

        
      try
      {
       await finalBid.save();
       // res.send("Buy bid(LimitPrice) placed").status(200);

       profile.lockedCash = bidPrice*volume;
       profile.availableCash = availableCash - profile.lockedCash;
       profile.availableCash = profile.availableCash -(((bidPrice*volume)/100)*5);

      await publish('bid',finalBid);
      await publish('profile',profile);


      }
      catch(e)
      {

        res.send("Placing bid failed").status(404);
      }
    }


    //MArketPrice bid
    else if(type === "marketprice")
    {
     
      const finalBid = new Bid({
      user:_id,
      company:companyName,
      volume:volume,
      price:bidPrice,
      category:"marketprice",
      action:"buy"});
  
      try
      {
      await finalBid.save();
       // res.send("Buy bid(MarketPrice) placed").status(200);

      
      profile.lockedCash = bidPrice*volume;
      profile.availableCash = availableCash - profile.lockedCash;
      profile.availableCash = profile.availableCash -(((bidPrice*volume)/100)*5);

      await publish('bid',finalBid);
      await publish('profile',profile);

      }

      catch(e)
      {
        res.send("Placing bid failed").status(404);
      }                        
    }
  })
}

else
{

  //May return List of 1 object or just the object not sure

  const companyStock = userStocks.filter( (stock)=> {

    return company === companyName;

  })

  if(companyStock.volume < volume)
  {
    res.send("Bid is invalid insufficient stocks found").status(200);
  }

  const finalBid = new Bid({
  user:_id,
  company:companyName,
  volume:volume,
  price:bidPrice,
  category:"#",//Not sure about the cateogries in sell bid
  action:"sell"});

    try
    {

    await finalBid.save();
     // res.send("Bid Placed(Sell Bid)").status(200);
    await publish('bid',finalBid);

    }

    catch(e)

    {
      res.send("Placing bid failed");
    }
}

//Publishing the BIDS
/*
If publishing fails bid should be entirely cancelled as
it wont get executed
not yet implemented
*/

//Here the bid is removed from user data as it failed to be published
//
//
res.send("Bid Placed(Sell Bid)").status(200);

});

tradeServer.post("/trade/cancel/", async(req, res) => {
  // cancel pending bid
  // the bid id,which is sent in the url params, will be used to find and cancel the bid
  // cancellation will also be published to a queue

  const bidId = req.params.bidId;
  const _id = req._id;

  try 
  {

  Bid.findOneAndDelete({_id:bidId},function(err,data) {

    if(err)
    {
      res.send("Error while cancelling trade").status(404);
    }

    await publish('cancelledBid',data);

   

})


res.send("Bid sucessfully cancelled").status(200);
}
catch(e)
{
  res.send("Bid cancellation failed").status(404);
}


});

// TODO: allow users to cancel bids themselves
tradeServer.listen(PORT, () => {
  console.log(`User Account service Running on ${PORT}....`);
});

//TODO: ANNOUNCE TO SERVICE DISCOVERY
