const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const companySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  price: { type: Number },
  volumeInCirculation: { type: Number },
  volumeReserved: { type: Number },
  category: { type: String },
  sector: { type: String }
});

const bidSchema = new mongoose.Schema(
  {
    user: { type: ObjectId },
    company: { type: String },
    volume: { type: Number },
    price: { type: Number },
    category: { type: String },
    action: { type: String },
    _id: { type: ObjectId }
  },
  { timestamps: true }
);
bidSchema.index({ company: 1, price: 1, action: 1 });

const succesfullTransactionSchema = new mongoose.Schema(
  {
    buyer: { type: ObjectId },
    seller: { type: ObjectId },
    company: { type: ObjectId },
    volume: { type: Number },
    price: { type: Number }
  },
  { timestamps: true }
);

const Company = mongoose.model("company", companySchema);
const Bids = mongoose.model("bids", bidSchema);
const Transaction = mongoose.model("transactions", succesfullTransactionSchema);

module.exports = {
  Company: Company,
  companySchema: companySchema,
  Bids: Bids,
  bidSchema: bidSchema,
  Transaction: Transaction,
  transactionSchema: succesfullTransactionSchema
};
