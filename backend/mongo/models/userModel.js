const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: String,
  username: String,
  password: String,
  email: String,
  phone: String,
  liked: Array,
  pfp: String,
});

module.exports = mongoose.model("User", userSchema);
