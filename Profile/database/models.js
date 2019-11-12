const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  availableCash: {type: Number, default: 400000},
  lockedCash: {type: Number, default: 0},
  totalCash: {type: Number, default: 400000},
  portfolio: [
    {
      name: {type: String},
      currentPrice: {type: Number},
      volume: {type: Number},
    },
  ],
  stockWorth: {type: Number, default: 0},
  netWorth: {type: Number, default: 400000},
});

const pendingBidSchema = new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      company: {type: String},
      volume: {type: Number},
      bidPrice: {type: Number},
      bidType: {type: String},
      bidOption: {type: String},
      expiresOn: {
        type: Date,
        default: new Date(30 * 60 * 1000 + Date.now()),
      },
    },
    {timestamps: {createdAt: 'created_at'}},
);

const Profile = mongoose.model('Profiles', profileSchema);
const pendingTransactions = mongoose.model(
    'PendingTransactions',
    pendingBidSchema,
);

module.exports = {
  Profile: Profile,
  pendingTransactions: pendingTransactions,
};
