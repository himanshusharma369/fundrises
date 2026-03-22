const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ✅ NAME (optional but useful)
    name: {
      type: String,
      trim: true,
      default: "",
    },

    // ✅ EMAIL
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ✅ PASSWORD (hashed)
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    // ✅ ROLE (for admin future use)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);