const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
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
const Bid = mongoose.model("Bids", bidSchema);

const cancellationScehma = new mongoose.Schema(
  {
    _id: { type: ObjectId }
  },
  { timestamps: true }
);
const Cancel = mongoose.model("cancelllation", cancellationScehma);
module.exports = { Bid: Bid, Cancel: Cancel };
