
//IPO populate in database 

const mongoose = require('mongoose')
const fs = require('fs')
const {ipo,ipoBid,ipoUserBid} = require('./models')


async function init()
{
    try{

    let companyIPO =  JSON.parse(fs.readFileSync("./Database/company.json"))
    for(data in companyIPO)
    {
        const tempIPO = companyIPO[data]
        tempIPO.name = data
        const newIPO = new ipo(tempIPO)
        await newIPO.save()
        console.log(newIPO)
           
    }
}catch(e)
{
    console.log(e)
}
 
}

init()

