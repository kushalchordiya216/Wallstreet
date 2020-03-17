const request = require("supertest");
const { server } = require("../src/server");

/********************************   Registration Tests    ********************************/
test("Registration positive test", async () => {
  await request(server)
    .post("/register")
    .send({
      name: "dummyuser",
      email: "dummyuser@gmail.com",
      password: "DummyUser123"
    })
    .expect(201)
    .expect(res => {
      if (res.body.name != "dummyuser" || res.body.cash != 4000000) {
        throw new Error("Unexpected response value");
      }
    });
});

test("duplicate entry test", async () => {
  //duplicate entry test
  await request(server)
    .post("/register")
    .send({
      name: "Kushal Chordiya",
      email: "chordiyakushal@gmail.com",
      password: "Kushal123"
    })
    .expect(400);
});

test("invalid email check", async () => {
  await request(server)
    .post("/register")
    .send({
      name: "Kushal Chordiya",
      email: "chordiyakushal",
      password: "Kushal123"
    })
    .expect(400);
});

test("invalid password check", async () => {
  await request(server)
    .post("/register")
    .send({
      name: "Kushal Chordiya",
      email: "chordiyakushal@gmail.com",
      password: "kushal123"
    })
    .expect(400);
});
//invalid password test

/*************************************** Login Request **********************************/

test("Login page", async () => {
  await request(server)
    .get("/login")
    .expect(200);
});

test("Login positive test", async () => {
  await request(server)
    .post("/login")
    .send({ email: "ngawade911@gmail.com", password: "Nikhil123" })
    .expect(302);
});

test("Login Negative test", async () => {
  await request(server)
    .post("/login")
    .send({ email: "chordiyakushal@gmail.com", password: "kushal123" }) //incorrect password
    .expect(400);
});
