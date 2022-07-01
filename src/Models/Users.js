const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },

  identification: {
    type: String,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },

  purchases: [
    {
      type: Schema.Types.ObjectId,
      ref: "Purchase",
      default: [],
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
