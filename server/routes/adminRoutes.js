import express from 'express';
import User from '../models/User.js';
import Pet from '../models/Pet.js';
import { isAdmin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all users - Admin only
router.get('/users', protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET all pets (admin only)
router.get("/pets", protect, isAdmin, async (req, res) => {
  try {
    const pets = await Pet.find().populate("listedBy", "name email");
    res.json(pets);
  } catch (err) {
    console.error("Failed to fetch pets:", err);
    res.status(500).json({ message: "Failed to fetch pets", error: err.message });
  }
});

// DELETE user by id - Admin only
router.delete('/users/:id', protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE pet by id - Admin only
router.delete('/pets/:id', protect, isAdmin, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) return res.status(404).json({ message: "Pet not found" });

    if (pet.status === "Adopted") {
      return res.status(400).json({ message: "Cannot delete an adopted pet" });
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: "Pet deleted successfully" });
  } catch (error) {
    console.error("Delete pet error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




router.get("/verifications", protect, isAdmin, async (req, res) => {
  const pendingUsers = await User.find({ verificationStatus: "pending" }).select("name email idDocument");
  res.json({ users: pendingUsers });
});

//accept user
router.put("/verify-user/:id", protect, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isVerified = true;
  user.verificationStatus = "verified";
  await user.save();

  res.json({ message: "User verified successfully" });
});

//reject verification
router.put('/reject-user/:id', protect, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isVerified = false;
  user.verificationStatus = "rejected";
  await user.save();

  res.json({ message: "User verification rejected" });
});



export default router;
