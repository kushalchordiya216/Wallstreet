const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, unique: true },
  price: { type: Number },
  volumeInCirculation: { type: Number },
  volumeReserved: { type: Number },
  tier: { type: String },
  sector: { type: String }
});

const Company = mongoose.model("company", companySchema);
module.exports = Company
