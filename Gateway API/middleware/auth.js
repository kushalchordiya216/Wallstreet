const jwt = require("jsonwebtoken");
const { User } = require("../database/models");

const known_tokens = {};

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.Authorization;
    const decodedToken = jwt.verify(token, "secretkey");
    if (decodedToken in known_tokens) {
      req._id = decodedToken;
      req.token = token;
    } else {
      console.log("Fetching token from db");
      const user = await User.findOne({
        // eslint-disable-next-line quotes
        _id: decodedToken._id,
        "tokens.token": token
      });
      if (!user) {
        throw new Error("Request needs to be Authenticated!\n");
      }
      known_tokens[decodedToken] = token;
      req._id = decodedToken;
      req.token = token;
    }
  } catch (e) {
    res.clearCookie("Authorization");
    console.log(e);
    res.status(302).redirect("/login");
  }
  next();
};

// use in memory object for now, can be scaled to redis later on if needed

module.exports = { auth: auth, known_tokens: known_tokens };
