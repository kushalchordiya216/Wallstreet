const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { server } = require("../src/server");
const { userSchema } = require("../database/models");

let cookies = [];
let users = [];
let User = mongoose.model("users", userSchema);

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
});

test("Get user profile positive", async () => {
  let response = await request(server)
    .get("/profile")
    .set("Cookie", [`Authorization=${cookies[2]}`])
    .send()
    .expect(200);
  expect(response.body.name).toBe(users[2].name);
});

test("Get user profile negative", async () => {
  await request(server)
    .get("/profile")
    .set("Cookie", [`Authorization=$noauth`])
    .send()
    .expect(302);
});

test("logout user", async () => {
  await request(server)
    .get("/logout")
    .set("Cookie", [`Authorization=${cookies[3]}`])
    .send()
    .expect(302);
  let user = await User.findById(users[3]._id);
  if (user.tokens.length != 0) {
    throw new Error("Could not remove token on logout");
  }
});

test("update password", async () => {
  let response = await request(server)
    .post("/updatePassword")
    .set("Cookie", [`Authorization=${cookies[0]}`])
    .send({ password: "Kushal1234" })
    .expect(302);

  let user = await User.findById(users[0]._id);
  if (!bcrypt.compare("Kushal1234", user.password)) {
    console.log(user);
    throw new Error("password not properly updated");
  }
});
