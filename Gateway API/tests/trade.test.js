const request = require("supertest");
const mongoose = require("mongoose");
const { server } = require("../src/server");
const jwt = require("jsonwebtoken");
const { userSchema } = require("../database/models");
const { profileSchema } = require("../../Profile/database/models");
let users = [];
let cookies = [];
let User = mongoose.model("users", userSchema);
let Profile = mongoose.model("profiles", profileSchema);

beforeAll(async () => {
  users = await User.find();
  for (let user of users) {
    const token = jwt.sign({ _id: user._id.toString() }, "secretkey", {
      expiresIn: "1d"
    });
    obj = { token: token };
    await User.updateOne({ _id: user._id }, { $push: { tokens: obj } });
    cookies.push(token);
  }

  let company1 = { company: "RIL", volume: 250, price: 1105 };
  let company2 = { company: "TCS", volume: 400, price: 1806 };

  await Profile.updateOne(
    { _id: users[2]._id },
    { $push: { stocks: company1 } }
  );
  await Profile.updateOne(
    { _id: users[3]._id },
    { $push: { stocks: company2 } }
  );
});

/*********************************** Buy Tests ************************************/
test("Positive Buy Test", async () => {
  await request(server)
    .post("/trade/SBI")
    .set("Cookie", [`Authorization=${cookies[0]}`])
    .send({
      volume: 1000,
      price: 250,
      action: "buy"
    })
    .expect(202);
});

test("Negative Buy Test", async () => {
  let response = await request(server)
    .post("/trade/HDFC")
    .set("Cookie", [`Authorization=${cookies[0]}`])
    .send({
      volume: 1950,
      price: 2100,
      action: "buy"
    })
    .expect(406);
  expect(response.text).toBe("Enough cash is not available");
});

test("Circuit limit Buy test", async () => {
  let response = await request(server)
    .post("/trade/SBI")
    .set("Cookie", [`Authorization=${cookies[0]}`])
    .send({
      volume: 1000,
      price: 300,
      action: "buy"
    })
    .expect(406);
  expect(response.text).toBe("Bid not Allowed, exceeds circuit limit!");

  let response2 = await request(server)
    .post("/trade/SBI")
    .set("Cookie", [`Authorization=${cookies[0]}`])
    .send({
      volume: 1000,
      price: 190,
      action: "buy"
    })
    .expect(406);
  expect(response2.text).toBe("Bid not Allowed, exceeds circuit limit!");
});

/********************************************  Sell tests *****************************************/
test("Positive Sell Test", async () => {
  await request(server)
    .post("/trade/RIL")
    .set("Cookie", [`Authorization=${cookies[2]}`])
    .send({
      volume: 150,
      price: 1100,
      action: "sell"
    })
    .expect(202);
});

test("Negative Sell Test", async () => {
  let response = await request(server)
    .post("/trade/TCS")
    .set("Cookie", [`Authorization=${cookies[3]}`])
    .send({
      volume: 500,
      price: 1700,
      action: "sell"
    })
    .expect(406);
  expect(response.text).toBe("Bid is invalid insufficient stocks found");
});

test("Circuit limit Sell test", async () => {
  let response = await request(server)
    .post("/trade/TCS")
    .set("Cookie", [`Authorization=${cookies[3]}`])
    .send({
      volume: 200,
      price: 2500,
      action: "sell"
    })
    .expect(406);
  expect(response.text).toBe("Bid not Allowed, exceeds circuit limit!");

  let response2 = await request(server)
    .post("/trade/TCS")
    .set("Cookie", [`Authorization=${cookies[3]}`])
    .send({
      volume: 100,
      price: 1000,
      action: "sell"
    })
    .expect(406);
  expect(response2.text).toBe("Bid not Allowed, exceeds circuit limit!");
});
