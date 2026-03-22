const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema(
  {
    // ✅ Campaign reference
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    // ✅ Donor (user)
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Amount
    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    // ✅ Payment status (important for Razorpay)
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "success",
    },

    // ✅ Razorpay fields (optional but important later)
    razorpayOrderId: String,
    razorpayPaymentId: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donationSchema);