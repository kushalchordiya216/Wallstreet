const jwt = require('jsonwebtoken');
const {User} = require('../database/models');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.Authorization;
    const decodedToken = await jwt.verify(token, 'secretkey');
    const user = await User.findOne({
      '_id': decodedToken._id,
      'tokens.token': token,
    });
    if (!user) {
      throw new Error('Request needs to be Authenticated!\n');
    }
    req.user = user;
    next();
  } catch (e) {
    res.clearCookie('Authorization');
    console.log(e);
    res.status(302).redirect('/login');
  }
};

module.exports = {auth: auth};
