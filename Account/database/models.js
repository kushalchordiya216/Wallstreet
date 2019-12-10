const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const profileSchema = new mongoose.Schema({
  user: { type: ObjectId },
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

profileSchema.methods.lockCash = function(cash) {
  this.availableCash -= cash;
  this.lockedCash += cash;
};

//TODO: portfolioSchema.statics.calcStockWorth;
