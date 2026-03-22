const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    let token;

    // ✅ Check Authorization header (Bearer token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Attach user to request
    req.user = {
      id: decoded.id,
    };

    next();

  } catch (error) {
    console.error("JWT ERROR:", error.message);

    // 🔥 Better error messages
    let message = "Invalid token";

    if (error.name === "TokenExpiredError") {
      message = "Token expired";
    }

    return res.status(401).json({
      success: false,
      message,
    });
  }
};

module.exports = { protect };