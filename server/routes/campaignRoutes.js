const express = require("express");
const router = express.Router();

const {
  createCampaign,
  getMyCampaigns,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign,
  donateToCampaign,
} = require("../controllers/campaignController");

const { protect } = require("../middleware/authMiddleware");

router.get("/", getAllCampaigns);                          // Public
router.post("/create", protect, createCampaign);          // Admin
router.get("/my-campaigns", protect, getMyCampaigns);     // Admin
router.put("/:id", protect, updateCampaign);              // Admin
router.delete("/:id", protect, deleteCampaign);           // Admin
router.post("/donate/:id", protect, donateToCampaign);    // User

module.exports = router;