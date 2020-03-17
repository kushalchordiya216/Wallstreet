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
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String },
  avatar: { type: String },
  cash: {
    type: Number,
    default: 4000000
  },
  netWorth: { type: Number, default: 4000000 },
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
  ]
});
profileSchema.index({ netWorth: -1 });

profileSchema.statics.updateNetWorth = function() {
  const profiles = this.find();
  let updateQueries = [];
  for (profile in profiles) {
    if (profile.isModified("stocks") || profile.isModified("cash")) {
      let stockWorth = profile.stocks.reduce((total, stock) => {
        return (total += stock.volume * stock.price);
      }, 0);
      let updateQuery = {
        updateOne: {
          filter: {
            _id: profile._id
          },
          update: {
            netWorth: stockWorth + profile.cash
          }
        }
      };
      updateQueries.push(updateQuery);
    }
  }
  this.bulkWrite(updateQueries);
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
 * - market price/stop loss
 * - options
 * - futures
 * To know how each category of bid is processed, visit Transactions/src/controller/transactions.js
 */
const bidSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "profile" }, //was String
    company: { type: String },
    volume: { type: Number },
    price: { type: Number },
    category: { type: String, default: "stocks" },
    action: { type: String },
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

bidSchema.pre("save", async function() {
  if (this.action === "buy") {
    await Profile.where({ _id: this.user._id })
      .update({ $inc: { cash: -(this.price * this.volume) * 1.05 } })
      .exec();
  } else if (this.action === "sell") {
    await Profile.where({
      _id: this.user._id,
      "stocks.company": this.company
    })
      .update({ $inc: { "stocks.$.volume": -this.volume } })
      .exec();
  }
});

bidSchema.pre("findOneAndUpdate", async function() {
  if (this.action === "buy") {
    await Profile.where({ _id: this.user._id })
      .update({ $inc: { cash: this.price * this.volume } })
      .exec();
  } else if (this.action === "sell") {
    await Profile.where({ _id: this.user._id, "stocks.company": this.company })
      .update({ $inc: { "stocks.$.volume": -this.volume } })
      .exec();
  }
});

const Bid = mongoose.model("Bids", bidSchema);

module.exports = {
  Bid: Bid,
  Profile: Profile,
  bidSchema: bidSchema,
  profileSchema: profileSchema
};
