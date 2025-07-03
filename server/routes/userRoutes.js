import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { getUserProfile } from "../controllers/userController.js";
import { updateUserPreferences } from '../controllers/updateUserPreferences.js';

const router = express.Router();

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private

// Save user preferences
router.put("/preferences", protect, async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences) return res.status(400).json({ msg: "No preferences provided" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.preferences = preferences;
    await user.save();

    res.status(200).json({ msg: "Preferences saved", user });
  } catch (error) {
    console.error("❌ Error saving preferences:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "User routes working!" });
});

router.get("/:id/profile", getUserProfile);




export default router;
