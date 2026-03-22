const Razorpay = require("razorpay");

// ✅ INIT RAZORPAY
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    // ✅ Validate amount
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const options = {
      amount: Number(amount) * 100, // ₹ → paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // unique receipt
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });

  } catch (error) {
    console.error("RAZORPAY ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Payment order creation failed",
    });
  }
};