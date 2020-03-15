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

const Buy = mongoose.model("buytable", bidSchema);
const Sell = mongoose.model("selltable", bidSchema);

/**
 * Schema for completed transactions
 */
const transactionSchema = new mongoose.Schema(
  {
    buyer: { type: ObjectId },
    seller: { type: ObjectId },
    buybid: { type: ObjectId },
    sellbid: { type: ObjectId },
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
  Transactions: Transactions
};
