import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

const router = express.Router();

// @route   POST /api/register
// @desc    Register a new user
// @access  Public
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  try {
    const { name, email, password, location } = req.body;
    const locationObj = typeof location === 'string' ? JSON.parse(location) : location;
    const profilePicture = req.file ? `uploads/${req.file.filename}` : "";

    console.log("📥 Incoming Request:", req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("🔐 Password hashed");

    // Create and save the user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      location: locationObj,
      profilePicture,
    });

    await newUser.save();
    console.log("✅ User saved to DB");

    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// @route   POST /api/login
// @desc    Login user and return token
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Generate JWT
    const jwt = await import("jsonwebtoken");
    const token = jwt.default.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    location: user.location,
    profilePicture: user.profilePicture,
    verificationStatus: user.verificationStatus,
    isVerified: user.isVerified,
  }
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Get current logged-in user
router.get("/me", protect, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    location: req.user.location,
  });
});




export default router;
