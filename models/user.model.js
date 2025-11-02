const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please enter user name"],
  },
  slug: {
    type: String,
    require: [true, "Please enter slug"],
    unique: true,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
