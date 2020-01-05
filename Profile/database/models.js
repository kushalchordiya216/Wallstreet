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
  user: { type: ObjectId, required: true, unique: true },
  email: { type: String, required: true, unique: true },
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
  },
  stocks: [
    {
      company: {
        type: String
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

//TODO: profileSchema.statics.calcStockWorth;

const Profile = mongoose.model("profile", profileSchema);

module.exports = Profile;
