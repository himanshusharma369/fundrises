const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes"); // 1. Add this

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/campaign", campaignRoutes); 
app.use("/api/user", userRoutes); 
app.use("/api/payment", paymentRoutes); // 2. Add this (Fixes 404)

module.exports = app;