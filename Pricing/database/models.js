const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  price: { type: Number },
  volumeInCirculation: { type: Number },
  volumeReserved: { type: Number },
  tier: { type: String },
  sector: { type: String },
  portfolio: { type: String }
});

const Company = mongoose.model("companies", companySchema);

module.exports = {
  Company: Company,
  companySchema: companySchema
};
