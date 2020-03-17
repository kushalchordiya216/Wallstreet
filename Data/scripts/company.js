const fs = require("fs");
const mongoose = require("mongoose");
const { companySchema } = require("../../Pricing/database/models");
let host = "localhost";
let port = 27017;
let name = "Wallstreet";

async function init() {
  try {
    await mongoose.connect(`mongodb://${host}:${port}/${name}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    const Company = mongoose.model("companies", companySchema);
    await Company.deleteMany({});
    let rawdata = fs.readFileSync("./JSON/company.json");
    let data = JSON.parse(rawdata);
    for (cname in data) {
      let company = { name: cname };
      let dbentry = { ...company, ...data[cname] };
      let entry = new Company(dbentry);
      await entry.save();
      console.log(`Done with ${cname}\n`);
    }
  } catch (error) {
    console.log(error);
  }
}

init().then(() => {
  console.log("company collection initialized");
  return;
});
