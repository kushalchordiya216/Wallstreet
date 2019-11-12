const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {type: String},
  sector: {type: String},
  category: {type: String},
  currentMarketPrice: {type: Number},
  rating: {type: String},
  totalVolume: {type: Number},
  buyVolume: {type: Number},
  sellVolume: {type: Number},
});

const Company = mongoose.model('Companies', companySchema);

module.exports = {Company: Company};
