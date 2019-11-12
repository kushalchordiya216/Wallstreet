const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {
      buyer: {type: mongoose.Schema.Types.ObjectId},
      seller: {type: mongoose.Schema.Types.ObjectId},
      company: {type: mongoose.Schema.Types.ObjectId},
      price: {type: Number},
    },
    {timestamps: {createdAt: 'created_at'}},
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {Transaction: Transaction};
