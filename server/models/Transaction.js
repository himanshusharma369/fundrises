const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    // ✅ Razorpay order ID
    orderId: {
      type: String,
      required: true,
    },

    // ✅ Razorpay payment ID
    paymentId: {
      type: String,
      default: "",
    },

    // ✅ Campaign reference
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    // ✅ User who paid
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Amount paid
    amount: {
      type: Number,
      required: true,
    },

    // ✅ Payment status
    status: {
      type: String,
      enum: ["created", "success", "failed"],
      default: "created",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);