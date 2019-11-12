const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      bidType: {type: String},
      bidOption: {type: String},
      company: {type: String},
      price: {type: Number},
      volume: {type: Number},
      expiresOn: {type: Date, default: new Date(Date.now() + 30 * 60 * 1000)},
    },
    {timestamps: {createdAt: 'create_at'}},
);

const Bids = mongoose.model('bids', bidSchema);

module.exports = {Bids: Bids};
