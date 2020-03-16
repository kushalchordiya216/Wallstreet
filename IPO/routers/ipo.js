const express = require('express')
const request = require("request-promise");
const {ipo,ipoBid , ipoUserBid} = require('../Database/models')
const publish = require('../kafka/profpublish')
const router = new express.Router()


/*
               ***IMP***
**SYNCHRONISE PROFILE OR PLACE THIS MODULE in PROFILE 
**ELSE profile updates would get FUCKED


*/

/*

FLOW
1:-Initialise IPO collection from company.json

2:-Launch IPO by sending list of companies to be launched

3:-Create a Bids by placing Bids ***Volume Of Bids IS lot variable which is present in models as well***

4:-Whenever we feel like execute Bids 

5:-Stop IPO it updates all volumeincirculation and volumeinReserve

6:-COmpany offering API to send current IPO offerings to the User

*/

/*

**The IPO Bids are handled on First come first serve basis**
*/ 




router.post('/ipo/execute',async(req,res)=>{

    //LOT quantity has to be changed when required
try{
    const lot =10

    //list of ipo companies 
    const companies = req.body.companies
    let bids = {}
    
/* 

**Grouping Bids By their company Name**

*/
    for(const element in companies)
    {
    
        const tempBids = await ipoUserBid.find({name:companies[element]})
        bids[companies[element]] = tempBids
    }
    
  
/*

**Processing Bids according to the company Name**

*/

    for(const data in bids)
    {
      
        const ipoDetail = await ipoBid.findOne({name:data})
        const tempBid = bids[data]
        //Randomize
        for (var i = tempBid.length - 1; i > 0; i--) 
        {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = tempBid[i];
            tempBid[i] = tempBid[j];
            tempBid[j] = temp;
        }
       // console.log(tempBid)
       
    /*

    **Processing each bid one by one** 

    */ 
        for(const element in tempBid)
        {
           // console.log(element.userName)
            
            if(Number(ipoDetail.volume)>0)
            {
               
                
                let newVol=0
                if(ipoDetail.volume>=lot)
                {
                ipoDetail.volume-=lot
                ipoDetail.volumeInCirculation+=lot
                }
                else
                {
                    ipoDetail.volumeInCirculation+=ipoDetail.volume
                    newVol= ipoDetail.volume
                    ipoDetail.volume=0 
                        
                }
                const options1 = {
                    uri: `http://localhost:3002/profile`,
                    method: "GET",
                    body: {
                      name: JSON.stringify(tempBid[element].userName)
                    },
                    json: true
                  };
                
                  const profile  = await request(options1);
                 

                  /*

                  **Reassigning Stocks of the Person**

                  */


                  //DOUBTFUL:: What if stocks.forEach is half complete and we start publishing


                  const stocks = profile.stocks
                  const assignStock = []
                  let flag=0

                  stocks.forEach(stock=>{
                    //  console.log(element.name)
                   //   console.log(name)
                   
                      if(ipoDetail.name==stock.name)
                      {
                           if(newVol==0)
                           {
                          stock.volume+=lot
                           }
                           else
                           {
                            stock.volume+=newVol
                           }
                          flag=1
                      }
                      assignStock.push(stock)
          
                  })
                  if(flag==0)
                  {
                    
                    if(newVol==0)
                    { 
                        const newStock = {name:ipoDetail.name,
                        volume:lot,
                        price:ipoDetail.price}
                        assignStock.push(newStock)
                    }
                    else
                    {
                        const newStock = {name:ipoDetail.name,
                        volume:newVol,
                        price:ipoDetail.price}
                        assignStock.push(newStock)
                    }
                     
                  }
                  profile.stocks=assignStock

                  console.log(profile)
                  await ipoDetail.save()
                  await publish(profile)     
            }

            /*

            **As Volume is Finished IPO processing is stopped**

            */

            else 
            {
                break
            }
        }
   
    }
    res.send("Bids executed").status(200)

}catch(e)
{
    console.log(e)
    res.send("Bids execution Failed").status(404)
}

})

//Post request with company names to launch the ipo
router.post('/ipo/launch',async (req,res)=>{

    try{
    //List of company names as object i.e. [{name:tcs},{name:tcs}] to launch or relaunch
    const companyName = req.body.ipo
   // console.log(companyName)
    
    const ipoDetail = await ipo.find({$and:
        [{$or:companyName},
            {volumeReserved:{$gt:0}
        }]})

       // console.log(ipoDetail)
        console.log(ipoDetail)
    ipoDetail.forEach(element=>{
       // console.log(element)
        const ipoBidElem = new ipoBid(
            {volume:element.volumeReserved,
            name:element.name,
            price:element.price,
            volumeInCirculation:element.volumeInCirculation
        }) 
          //  console.log(ipoBidElem)
        ipoBidElem.save()

    })
     //Not working for some reason
        //await ipo.updateMany({$or:companyName},{$set:[{volumeInCirculation:"$volumeReserved"},{volumeReserved:0}]})
    res.send("IPOS Created").status(200)
}
catch(e)
{
    console.log(e)
    res.send("IPO creation Failed").status(404)
}
})

//Dont allow user to bid for more than available for sale
router.post('/ipo/buy',async (req,res)=>{

    try {    

        const ipoDetail = await ipoBid.find({name:req.body.name})
        if(ipoDetail)
        {       
        const userBid = new ipoUserBid({name:req.body.companyName,userName:req.body.name})
        await userBid.save()
        console.log(userBid)
        res.send("Bid Acknowledged").status(200)
        }
        else
        {
            res.send("Ipo not Present").status(200)
        }

//       ***   FIRST COME FIRST SERVE CODE JUST IN CASE  ***

   /* const name = req.params.companyName
    const bidInfo = req.body //userBID

   // const profile = await Profile.find({_id:bidInfo.userID})
   const options1 = {
    uri: `http://localhost:3002/profile`,
    method: "GET",
    body: {
      name: JSON.stringify(bidInfo.name)
    },
    json: true
  };

  const profile  = await request(options1);

    const ipoDetail = await ipoBid.findOne({name:name})
   // console.log(bidInfo)
   // console.log(ipoDetail)

    if(ipoDetail)
    {
        if(ipoDetail.volume>=bidInfo.volume && 
            (profile.cash>(ipoDetail.price*bidInfo.volume)))
        {
            profile.cash-=ipoDetail.price*bidInfo.volume
            ipoDetail.volume-=bidInfo.volume
            ipoDetail.volumeInCirculation+=bidInfo.volume
        

        const stocks = profile.stocks
        
        const assignStock = []
        let flag=0
        stocks.forEach(element=>{
          //  console.log(element.name)
         //   console.log(name)
            if(name==element.name)
            {
                element.volume+=bidInfo.volume
                flag=1
            }
            assignStock.push(element)

        })
        if(flag==0)
        {
            const newStock = {name:name,
                volume:bidInfo.volume,
                price:ipoDetail.price}
            assignStock.push(newStock)
        }
        profile.stocks=assignStock
    
        await ipoDetail.save()
        await publish(profile)
    
        res.send("Bid success").status(200)
        }

        //TODO::COde Duplication 

        //Partial bid 

        else if(ipoDetail.volume>0 && 
            (profile.cash>(ipoDetail.price*ipoDetail.volume)))
        {

            const stocks = profile.stocks
        
            const assignStock = []
            let flag=0
            stocks.forEach(element=>{
                if(name==element.name)
                {
                    element.volume+=ipoDetail.volume
                    flag=1
                }
                assignStock.push(element)
    
            })
            if(flag==0)
            {
                const newStock = {name:name,
                    volume:ipoDetail.volume,
                    price:ipoDetail.price}
                assignStock.push(newStock)
            }
            profile.stocks=assignStock
           
            profile.cash-=ipoDetail.price*ipoDetail.volume
            ipoDetail.volumeInCirculation+=ipoDetail.volume
            ipoDetail.volume=0

            
            await ipoDetail.save()
            console.log(ipoDetail)
            await publish(profile)
            res.send("Bid success").status(200)
        }
        else
        {
            res.send("Insufficient funds or insufficient volume").status(404)
        }
        

    }
    else
    {
        throw new Error("IPO not present")
    }*/
}
catch(e)
{
    console.log(e)
    res.send("Some Error Occured").status(404)
}
})

//To stop the ipos
router.post(("/ipo/stop"),async (req,res)=>{

    
    try{
    //List of company names as object i.e. [{name:tcs},{name:tcs}] to launch or relaunch
    const companies = req.body.ipo

    const companies1 = await ipoBid.find({$or:companies})

    //TODO::Update ipo details with bulk queries
    //Updating ipo details i.e. circulation and reserved volumes
    companies1.forEach(async(element)=>{
        const volumeReserved = element.volume
        const volumeInCirculation = element.volumeInCirculation

        //Update ipo details

        await ipo.findOneAndUpdate({name:element.name},{volumeReserved:volumeReserved,
            volumeInCirculation:volumeInCirculation})
    })

    const deleted = await ipoBid.deleteMany({$or:companies})
    res.send("Ipos Stopped").status(200)
    }catch(e)
    {
        console.log(e)
        res.send("Ipo stop failed").status(404)
    }


})

//Sends a list of offerings
router.get(('/ipo/offerings'),async(req,res)=>{

    try{    
    const offerings = await ipoBid.find({volume:{$gt:0}})
    if(offerings)
    {
    res.send(offerings).status(200)
    }
    else
    {
    res.send("No ipos present at the momonet").status(404)
    }
}catch(e)
{
    console.log(e)
    res.send("No ipos present at the momonet").status(404)
}

})

module.exports = router