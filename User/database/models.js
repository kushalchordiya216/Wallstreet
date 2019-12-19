const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

/**
 * Schema for User Profile
 * available Cash is the cash the user can use to place bids for buying stocks
 * locked Cash is the cash locked in bids the user has already placed, 
   this money cant be considered when user is placing new bid
 * total cash is sum of both
 * Total worth is a cumulative addition of assets held as stock and cash, more weight is pressed on stocks
 */
const profileSchema = new mongoose.Schema({
  user: { type: ObjectId },
  email: { type: String },
  bio: { type: String },
  avatar: { type: String },
  availableCash: {
    type: Number,
    default: 4000000
  },
  lockedCash: {
    type: Number,
    default: 0
  },
  totalCash: {
    type: Number,
    default: 4000000
  },
  TotalWorth: {
    type: Number,
    default: 4000000
  }
});

const portfolioSchema = new mongoose.Schema({
  user: { type: ObjectId },
  assets: [
    {
      company: {
        type: ObjectId
      },
      volume: {
        type: Number
      },
      price: {
        type: Number
      }
    }
  ],
  stockWorth: {
    type: Number,
    default: 0
  }
});

profileSchema.methods.lockCash = function(cash) {
  this.availableCash -= cash;
  this.lockedCash += cash;
};

//TODO: portfolioSchema.statics.calcStockWorth;

/**
 * schema for different bids the users can make
 * most of the attributes are self explanatory
 * action can have two values (buy / sell)
 * category can have the following values
 * - market price
 * - limit price
 * - options
 * To know how each category of bid is processed, visit Market/src/transactions.js
 */
const bidSchema = new mongoose.Schema(
  {
    user: { type: ObjectId },
    company: { type: String },
    volume: { type: Number },
    price: { type: Number },
    category: { type: String },
    action: { type: String }
  },
  { timestamps: true }
);
