// *****modules*****
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// *****Schemas*****
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
});

// model:
const UserModel = mongoose.model("user", userSchema, "users");

// functions:
const add = async (data) => {
  // incripting the user passwords:
  const salt = await bcrypt.genSalt(10);
  data.password = await bcrypt.hash(data.password, salt);

  const newUser = new UserModel(data);
  const success = await newUser.save();

  if (success) {
    return true;
  } else {
    return false;
  }
};
const login = async (email, password) => {
  const user = await UserModel.findOne({ email: email });

  if (user && bcrypt.compareSync(password, user.password)) {
    return user._id;
  } else {
    return false;
  }
};

const emailTaken = async (email) => {
  const emailTakenOrNot = await UserModel.findOne({ email: email });

  if (emailTakenOrNot) return true;
  else return false;
};

module.exports = {
  add: add,
  login: login,
  emailTaken: emailTaken,
  UserModel: UserModel,
};
