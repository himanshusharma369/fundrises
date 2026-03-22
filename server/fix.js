const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Set new password to "123456"
  const hash = await bcrypt.hash("123456", 10);
  await mongoose.connection.collection("users").updateOne(
    { email: "himanshu@gmail.com" },
    { $set: { password: hash, role: "admin" } }
  );
  console.log("✅ Password reset to 123456 and role set to admin!");
  process.exit();
});