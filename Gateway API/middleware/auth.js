const jwt = require("jsonwebtoken");
const { User } = require("../database/models");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.Authorization;
    const decodedToken = jwt.verify(token, "secretkey");
    const user = await User.findOne({
      // eslint-disable-next-line quotes
      _id: decodedToken._id,
      "tokens.token": token
    });
    if (!user) {
      throw new Error("Request needs to be Authenticated!\n");
    }
    req.user = user;
    req._id = decodedToken._id;
    req.token = token;
    next();
  } catch (e) {
    res.clearCookie("Authorization");
    console.log(e);
    res.status(302).redirect("/login");
  }
};

// TODO Optimization: add caching of auth tokens so you dont need a db fetch everytime

module.exports = { auth: auth };
