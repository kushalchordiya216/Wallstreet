const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const { publish } = require("../utils/producers/publish");
/*
    Schema for buyTables and sellTables
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
bidSchema.index({ price: 1, company: 1 });

bidSchema.statics.fetch = async function(order, company, limit) {
  let results = await this.find({ company: company })
    .sort({ prices: order })
    .limit(limit);
  return results;
};

bidSchema.pre("remove", async function() {
  // publish to cancelled topic in kafka
  try {
    msg = { _id: this._id };
    await publish("Cancel", msg);
  } catch (e) {
    throw new Error("Publishing to cancellation failed");
  }
});

const Buy = mongoose.model("buytable", bidSchema);
const Sell = mongoose.model("selltable", bidSchema);
const Call = mongoose.model("calltable", bidSchema);
const Put = mongoose.model("puttable", bidSchema);

/**
 * Schema for completed transactions
 */
const transactionSchema = new mongoose.Schema(
  {
    buyer: { type: ObjectId },
    seller: { type: ObjectId },
    company: { type: String },
    volume: { type: Number },
    price: { type: Number },
    spread: { type: Number }
  },
  { timestamps: true }
);

const Transactions = mongoose.model("transactions", transactionSchema);

module.exports = {
  Buy: Buy,
  Sell: Sell,
  Call: Call,
  Put: Put,
  Transactions: Transactions
};
