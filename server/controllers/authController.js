const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 🔑 Generate Token Function
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ── REGISTER ────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    // ✅ Clean input
    email = email?.trim().toLowerCase();
    name = name?.trim();

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      name: name || "User",
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user", // 🔥 Safe role
    });

    // ✅ Generate token
    const token = generateToken(user);

    // ✅ Remove password
    const userData = user.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "Registration successful ✅",
      token,
      user: userData,
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ── LOGIN ──────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ Clean input
    email = email?.trim().toLowerCase();

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Generate token
    const token = generateToken(user);

    // ✅ Remove password
    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "Login successful ✅",
      token,
      user: userData,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};