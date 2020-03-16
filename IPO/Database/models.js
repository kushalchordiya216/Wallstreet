const mongoose = require('mongoose')

const ipoSchema = mongoose.Schema({
    volumeReserved:{type:Number},
    volumeInCirculation:{type:Number},
    name:{type:String},
    price:{type:Number},
    tier:{type:String},
    sector:{type:String}
})


const ipoBidSchema = mongoose.Schema({
    volume:{type:Number},
    name:{type:String},
    price:{type:String},
    volumeInCirculation:{type:Number}  //To avoid multiple call to database while stopping ipo
})

const ipoUserBidSchema = mongoose.Schema({
    userName:{type:String},
    name:{type:String},
    lotQuantity:{type:Number,default:10} //Dont provide quantity while creating model 
})



const ipo = mongoose.model('ipo',ipoSchema)
const ipoBid = mongoose.model('ipoBid',ipoBidSchema)
const ipoUserBid = mongoose.model('ipoUserBid',ipoUserBidSchema)
module.exports = { ipo , ipoBid , ipoUserBid}