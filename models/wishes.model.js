const mongoose = require("mongoose");

const WishesSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please enter your name"],
  },
  content: {
    type: String,
    require: [true, "Please enter your wishes"],
  },
  hidden: {
    type: Boolean
  },
  time: {
    type: String
  }
});

const Wishes = mongoose.model("Wishes", WishesSchema);
module.exports = Wishes;
