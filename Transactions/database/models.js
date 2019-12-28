const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

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
    _id: { type: ObjectId }
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
    company: { type: ObjectId },
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
