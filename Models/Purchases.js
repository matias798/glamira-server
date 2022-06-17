const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
  PaymentMethod: {
    type: String,
    trim: true,
  },

  status: {
    type: String,
    lowercase: true,
    trim: true,
  },
  transactionId: {
    type: String,
    lowercase: true,
    trim: true,
  },
});
module.exports = mongoose.model("Purchase", PurchaseSchema);
