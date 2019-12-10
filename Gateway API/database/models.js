const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(password) {
      const mediumRegex = new RegExp(
        // eslint-disable-next-line max-len
        "^(((?=.*[a-z])(?=.*[A-Z]))(?=.*[0-9])|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})"
      );
      if (!mediumRegex.test(password)) {
        throw new Error("Password does not match criteria");
      }
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(email) {
      const re = new RegExp(
        // eslint-disable-next-line max-len
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
      if (!re.test(email)) {
        throw new Error("Email given is invalid");
      }
    }
  },
  tokens: [
    {
      token: {
        type: String
      }
    }
  ],
  avatar: {
    type: String
  }
});

userSchema.pre("save", async function() {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "secretkey", {
    expiresIn: "1d"
  });
  user.tokens = user.tokens.concat({ token: token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async function(email, password) {
  const user = await User.findOne({ email: email });
  if (!user) {
    return new Error("Invalid Credentials");
  }
  const validCredentials = await bcrypt.compare(password, user.password);
  if (!validCredentials) {
    return new Error("Invalid Credentials");
  }
  return user;
};

const User = mongoose.model("users", userSchema);
module.exports = { User: User, userSchema: userSchema };
