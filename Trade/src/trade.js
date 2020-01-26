const express = require("express");
const kafka = require("kafka-node");
const request = require("request-promise");
const bidProducer = require("./kafka")
const publish = require("./publish")
const bodyparser = require("body-parser")



require("../database/connector");
const { Bid, Cancel } = require("../database/models");
const tradeServer = express();

//Essential to use express.json() else body wont be parsed
tradeServer.use(express.json());
const PORT = process.env.PORT || 3003;

tradeServer.get("/trade", async(req, res) => {
  // Basic trading terminal page, allows user to select a company to trade stocks of

  const options = {

      uri:"http://localhost:3000/index",
      //method:"GET",
      body:{
        _id:JSON.stringify(req.body._id)
        
      },
      json:true
  };

  try
  {

    const data = await request(options)
    res.send(data).status(200);

  }
  catch(e)
  {
    res.send("Something went wrong").status(404);
  }

});

tradeServer.get("/trade/company", async (req, res) => {
  // trade terminal for a particular company, will fetch and store company financials (current price)

  //Once fetched this data cant be modified so when user requests to bid we will fetch updated price and
  //show him updated price

  // ? how/where do i store it

  const companyName = req.body.company;
  const _id = req.body._id;
  const options = {
    uri:"http://localhost:3000/profile/"+ companyName ,
    //method:"GET",
    body:{
      _id:JSON.stringify({_id})
    }
    
  }

  try
  {

    const data = await request(options)
    if(data)
    res.send(data).status(200);

    else
    res.send("Company Not Present");

  }
  catch(e)
  {
    res.send("Something went wrong").status(404);
  }

});

tradeServer.post("/trade/placeBid", async(req, res) => {
  // TODO: Allow user to make bids, includes authenticating the bid by checking user financials and existing stock
  // TODO: publish all to kafka stream
  // To know about the different kinds of bids that can be made, see User/database/models.js/bidSchema
  
  
  
 
  const _id = req.body._id;
  const bidPrice = req.body.bidPrice;
  const volume = req.body.volume;
  const action = req.body.action;
  const type = req.body.type;

  //Company name can also be put as query string if required
  const companyName = req.body.companyName
 
  
  
 

  const options = {
    uri:"http://localhost:3001/profile/",
   // method:"GET",
    body:{
      _id:JSON.stringify(_id)
    },
    json:true
  }
  //

  try
  {
    
    const profile = await request(options)
    console.log(profile)
    const availableCash = profile.availableCash;
    const userStocks = profile.stocks; 

    console.log(availableCash);
    

    if(action === "buy")
  {

    //Checks if total cost + brokerage fees is available or not


    if(availableCash < (bidPrice*volume)+((bidPrice*volume)/100*5))
    {
      res.send("Enough cash is not available").status(200);
    }
    
    

    const options1 = {
      uri:"http://localhost:3006/profile",
     // method:"GET",
      body:{
        _id:JSON.stringify({_id}),
        companyName:companyName
      },
      json:true
    }

    const company1 = await request(options1)
    let stockPrice
    if(company1)
    {
    stockPrice = company1.price; //company1.stockPrice;
    }
    else
    {
      res.send("Company Not Present").status(200);
    }
    
    //Maximum limit price 
    //
    //

    if((stockPrice-bidPrice) > 40)
    {
      res.send("Bid not Allowed").status(200)
    }


     //Limit bid
    else if(type === "limit")
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
 
        await finalBid.save();
        // res.send("Buy bid(LimitPrice) placed").status(200);
 
        profile.lockedCash = bidPrice*volume;
        profile.availableCash = availableCash - profile.lockedCash;
        profile.availableCash = profile.availableCash -(((bidPrice*volume)/100)*5);
        
       publish("Bid",finalBid);
      // publishProfile("profile",profile);
       res.send("Bid Placed(Sell Bid)").status(200);
   
     }

     else if(type === "marketprice")
     {
       const finalBid = new Bid({
       user:_id,
       company:companyName,
       volume:volume,
       price:bidPrice,
       category:"marketprice",
       action:"buy"});
   
       
      
       await finalBid.save();
        // res.send("Buy bid(MarketPrice) placed").status(200);
 
       
       profile.lockedCash = bidPrice*volume;
       profile.availableCash = availableCash - profile.lockedCash;
       profile.availableCash = profile.availableCash -(((bidPrice*volume)/100)*5);

       
       await publish("Bids",finalBid);
       await publish("profile",profile);
       res.send("Bid Placed(Sell Bid)").status(200);
                       
     }

  }

  else
{

  //May return List of 1 object or just the object not sure

  const companyStock = userStocks.filter( (stock)=> {

    return company === companyName;

  })

  if(companyStock)
  {

  if(companyStock.volume < volume)
  {
    res.send("Bid is invalid insufficient stocks found").status(200);
  }

  else
  {

  const finalBid = new Bid({
  user:_id,
  company:companyName,
  volume:volume,
  price:bidPrice,
  category:"#",//Not sure about the cateogries in sell bid
  action:"sell"});
  
    await finalBid.save();
    await publish("Bid",finalBid);
    res.send("Bid Placed(Sell Bid)").status(200);
  }
}

else
{
  res.send("No Stock of specified company Present").status(200);
}

}



  }
  catch(e)
  {
    //res.send("Bid placing failed").status(404)
    console.log(e);
  }

 // res.send("Bid Placed(Sell Bid)").status(200);
  //
});

tradeServer.post("/trade/cancel", async(req, res) => {
  // cancel pending bid
  // the bid id,which is sent in the url params, will be used to find and cancel the bid
  // cancellation will also be published to a queue

  
  const _id = req.body._id;
  const bidId = req.body.bidId;
  
  var query = Bid.findOneAndDelete({_id:bidId});

  try
  {

  const data = await query.exec();

  if(data)
  {
  await publish("Cancel",data);
  res.send("Bid sucessfully cancelled").status(200);
  }
  else
  {
    res.send("Bid Not Present").status(200);
  }

  }
  catch(e)
  {
    res.send("Error while cancelling").status(404);
  }





});

// TODO: allow users to cancel bids themselves
tradeServer.listen(PORT, () => {
  console.log(`User Account service Running on ${PORT}....`);
});

//TODO: ANNOUNCE TO SERVICE DISCOVERY
