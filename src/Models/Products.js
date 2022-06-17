const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: {
    type: String,
    trim: true,
  },

  price: {
    type: Number,
  },

  description: {
    type: String,
    lowercase: true,
    trim: true,
  },
  category: {
    type: String,
  },
  image: {
    type: String,
  },
  rating: {
    type: Boolean,
  },
});
module.exports = mongoose.model("Products", ProductSchema);
