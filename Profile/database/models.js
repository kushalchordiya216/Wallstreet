const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

/**************************************************** Profile Collection ******************************************************/

/**
 * Schema for User Profile
 * available Cash is the cash the user can use to place bids for buying stocks
 * locked Cash is the cash locked in bids the user has already placed, 
   this money cant be considered when user is placing new bid
 * total cash is sum of both
 * Total worth is a cumulative addition of assets held as stock and cash, more weight is pressed on stocks
 */
const profileSchema = new mongoose.Schema({
  _id: ObjectId,
  name: { type: String, required: true, unique: true },
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

//TODO: optimize with worker threads
//TODO: Use MongoDB bulwrites instead of updateOne
profileSchema.statics.updateStockWorth = function() {
  const profiles = this.find();
  let updatedStockWorth = {};
  let total = 0;
  for (profile in profiles) {
    let stockWorth = profile.stocks.reduce((total, stock) => {
      return (total += stock.volume * stock.price);
    }, 0);
    updatedStockWorth[profile._id] = stockWorth;
  }
  for (_id in updatedStockWorth) {
    this.updateOne(
      { _id: _id },
      { $set: { stockWorth: updatedStockWorth[_id] } }
    );
  }
};

profileSchema.methods.updateProfile = async function() {
  try {
    const oldProfile = await Profile.findById(this._id);
    Object.assign(oldProfile, newProfile);
    await oldProfile.save();
    console.log("Profile Updated");
    return oldProfile;
  } catch (error) {
    return error;
  }
};

const Profile = mongoose.model("profile", profileSchema);

/*********************************************************Bids and Cancellations ******************************************/
/**
 * schema for different bids the users can make
 * most of the attributes are self explanatory
 * action can have two values (buy / sell)
 * category can have the following values
 * - market price
 * - limit price
 * - stop loss
 * To know how each category of bid is processed, visit Transactions/src/transactions.js
 */
const bidSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "profile" }, //was String
    company: { type: String },
    volume: { type: Number },
    price: { type: Number },
    category: { type: String },
    action: { type: String },
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

bidSchema.pre("save", async function updateProfile() {
  await Profile.where({ _id: this.user._id })
    .update({
      $inc: { lockedCash: this.price * this.volume }
    })
    .update({ $inc: { availableCash: -(this.price * this.volume) * 1.05 } })
    .exec();
});

bidSchema.pre("findOneAndRemove", async function updateProfile() {
  await Profile.where({ _id: this.user._id })
    .update({
      $inc: { lockedCash: -(this.price * this.volume) }
    })
    .update({ $inc: { availableCash: this.price * this.volume } })
    .exec();
});

const Bid = mongoose.model("Bids", bidSchema);

const cancellationScehma = new mongoose.Schema(
  {
    _id: { type: ObjectId }
  },
  { timestamps: true }
);
const Cancel = mongoose.model("cancellation", cancellationScehma);
module.exports = { Bid: Bid, Cancel: Cancel, Profile: Profile };
