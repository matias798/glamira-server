const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
  paymentMethod: {
    type: String,
    trim: true,
    default: null,
  },

  status: {
    type: String,
    trim: true,
    default: null,
  },
  total: {
    type: Number,
    default: null,
  },
  transactionId: {
    type: String,
    lowercase: true,
    trim: true,
    default: null,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Purchase", PurchaseSchema);
