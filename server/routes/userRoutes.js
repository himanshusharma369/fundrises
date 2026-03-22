const router = require("express").Router();

// ✅ FIX: correct import
const { protect } = require("../middleware/authMiddleware");

const Campaign = require("../models/Campaign");

// GET MY CAMPAIGNS (JWT Protected)
router.get("/my-campaigns", protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({
      createdBy: req.user.id,
    });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;