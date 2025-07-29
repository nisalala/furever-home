import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { getUserProfile } from "../controllers/userController.js";
import { updateUserPreferences } from '../controllers/updateUserPreferences.js';
import multer from "multer";
import path from "path";

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

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/idDocuments");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post(
  "/upload-id",
  protect,
  upload.single("idDocument"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      user.idDocument = `/uploads/idDocuments/${req.file.filename}`;
      user.verificationStatus = "pending";
      user.isVerified = false;
      await user.save();
      res.status(200).json({ message: "ID uploaded for verification." });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload ID." });
    }
  }
);


router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error in /me:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// @route PUT /api/users/:id/verify
// @desc Admin approves or rejects user verification
// @access Private/Admin only (you can add an isAdmin middleware later)
router.put("/:id/verify", protect, async (req, res) => {
  try {
    const { status } = req.body; // should be "verified" or "rejected"
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!["verified", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid verification status" });
    }

    user.verificationStatus = status;
    user.isVerified = status === "verified";
    await user.save();

    res.status(200).json({
      message: `User verification ${status}`,
      user,
    });
  } catch (error) {
    console.error("Error updating verification status:", error);
    res.status(500).json({ message: "Failed to update verification status" });
  }
});


export default router;
