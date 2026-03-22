const Campaign = require("../models/Campaign");

// ── CREATE ────────────────────────────────────────────────────
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, targetAmount, image } = req.body;

    if (!title || !description || description.length < 10 || !targetAmount) {
      return res.status(400).json({ message: "Invalid input" });
    }

    const campaign = await Campaign.create({
      title,
      description,
      targetAmount,
      image,
      createdBy: req.user.id,
    });

    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET ALL ───────────────────────────────────────────────────
exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── GET MY CAMPAIGNS ──────────────────────────────────────────
exports.getMyCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user.id });
    res.json({ campaigns });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── UPDATE (Admin only) ───────────────────────────────────────
exports.updateCampaign = async (req, res) => {
  try {
    const { title, description, targetAmount, image } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (targetAmount) campaign.targetAmount = targetAmount;
    if (image !== undefined) campaign.image = image;

    await campaign.save();
    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DELETE (Admin only) ───────────────────────────────────────
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.json({ success: true, message: "Campaign deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── DONATE ────────────────────────────────────────────────────
exports.donateToCampaign = async (req, res) => {
  try {
    const { amount } = req.body;
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ message: "Campaign not found" });

    campaign.collectedAmount += Number(amount);
    await campaign.save({ validateBeforeSave: false });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};