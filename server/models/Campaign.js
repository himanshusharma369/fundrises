const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    title: String,
    description: {
      type: String,
      minlength: 10,
    },
    targetAmount: Number,
    collectedAmount: {
      type: Number,
      default: 0,
    },
    image: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  createdBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);